import { isAddress } from 'ethers'

import vault from '../../../vault'
import { validateArgs } from '../../../../utils'
import { checkAdminAccess } from '../../../vault/transactions/operate/util'
import { rewardSplitterMulticall } from '../../../../contracts'
import type { FeeRecipient, UpdateFeeRecipientsInput } from './types'


const validateList = (values: Record<string, FeeRecipient[]>, withEmptyCheck?: boolean) => {
  Object.keys(values).forEach((key) => {
    const list = values[key]

    validateArgs.array({ [key]: values[key] }, withEmptyCheck)

    const isListValid = list.every(({ address, shares }) => (
      isAddress(address)
      && typeof shares === 'bigint'
    ))

    if (!isListValid) {
      throw new Error(`The "${key}" argument must be an array of objects with "address" and "shares" keys`)
    }
  })
}

export const commonLogic = async (values: UpdateFeeRecipientsInput) => {
  const {
    contracts, userAddress, vaultAddress, options,
    rewardSplitterAddress, feeRecipients,
  } = values

  let oldFeeRecipients: FeeRecipient[] = values.oldFeeRecipients as FeeRecipient[]

  validateArgs.address({ vaultAddress, userAddress, rewardSplitterAddress })
  validateList({ feeRecipients })

  if (oldFeeRecipients) {
    validateList({ oldFeeRecipients }, false)
  }

  await checkAdminAccess(values)

  const baseMulticall = {
    rewardSplitterContract: contracts.helpers.createRewardSplitter(rewardSplitterAddress),
    keeperContract: contracts.base.keeper,
    vaultAddress,
    userAddress,
    options,
  }

  if (!oldFeeRecipients) {
    const [ rewardSplitter ] = await vault.requests.getRewardSplitters({
      owner: userAddress,
      options,
      vaultAddress,
      rewardSplitterAddress,
    })

    if (rewardSplitter) {
      oldFeeRecipients = rewardSplitter.feeRecipients
    }
    else {
      throw new Error('Reward splitter not found')
    }
  }

  const increaseList: Record<string, bigint> = {}
  const decreaseList: Record<string, bigint> = {}
  const oldFeeRecipientAddresses = oldFeeRecipients.map(({ address }) => address.toLowerCase())

  oldFeeRecipients.forEach(({ address, shares }) => {
    const lowerCasedAddress = address.toLowerCase()
    const feeRecipient = feeRecipients.find((feeRecipient) => feeRecipient.address.toLowerCase() === lowerCasedAddress)

    if (feeRecipient) {
      const newShares = feeRecipient.shares
      const diff = newShares - shares

      if (diff > 0n) {
        increaseList[address] = diff
      }
      if (diff < 0n) {
        decreaseList[address] = shares - feeRecipient.shares
      }
    }
    else {
      decreaseList[address] = shares
    }
  })

  feeRecipients.forEach(({ address, shares }) => {
    const isNew = !oldFeeRecipientAddresses.includes(address.toLowerCase())

    if (isNew) {
      increaseList[address] = shares
    }
  })

  const params: Parameters<typeof rewardSplitterMulticall>[0]['request']['params'] = []

  Object.keys(increaseList).forEach((address) => {
    params.push({
      method: 'increaseShares',
      args: [ address, increaseList[address].toString() ],
    })
  })

  Object.keys(decreaseList).forEach((address) => {
    params.push({
      method: 'decreaseShares',
      args: [ address, decreaseList[address].toString() ],
    })
  })

  return {
    ...baseMulticall,
    request: {
      params,
    },
  }
}
