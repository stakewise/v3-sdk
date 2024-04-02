import { isAddress } from 'ethers'

import vault from '../../../vault'
import { validateArgs } from '../../../../utils'
import { checkAdminAccess } from '../../../vault/transactions/operate/util'
import { rewardSplitterMulticall } from '../../../../contracts'
import type { FeeRecipient, UpdateFeeRecipientsInput } from './types'


const validateList = (values: Record<string, FeeRecipient[]>) => {
  let totalPercent = 0n

  Object.keys(values).forEach((key) => {
    const list = values[key]

    validateArgs.array({ [key]: values[key] })

    const isListValid = list.every(({ address, percent }) => {
      const isFeeRecipientValid = (
        isAddress(address)
        && typeof percent === 'bigint'
      )

      if (isFeeRecipientValid) {
        totalPercent += percent
      }

      return isFeeRecipientValid
    })

    if (!isListValid) {
      throw new Error(`The "${key}" argument must be an array of objects with "address" and "percent" keys`)
    }
    if (totalPercent !== 100n) {
      throw new Error(`The sum of all percents in the "${key}" argument must be equal to 100`)
    }
  })
}

export const commonLogic = async (values: UpdateFeeRecipientsInput) => {
  const {
    contracts, userAddress, vaultAddress, options,
    rewardSplitterAddress, feeRecipients, oldFeeRecipients,
  } = values

  validateArgs.address({ vaultAddress, userAddress, rewardSplitterAddress })
  validateList({ feeRecipients })

  if (oldFeeRecipients) {
    validateList({ oldFeeRecipients })
  }

  await checkAdminAccess(values)

  const baseMulticall = {
    rewardSplitterContract: contracts.helpers.createRewardSplitter(rewardSplitterAddress),
    keeperContract: contracts.base.keeper,
    vaultAddress,
    userAddress,
    options,
  }

  const params: Parameters<typeof rewardSplitterMulticall>[0]['request']['params'] = []
  let currentShareHolders: FeeRecipient[]

  if (oldFeeRecipients) {
    currentShareHolders = oldFeeRecipients
  }
  else {
    const [ rewardSplitter ] = await vault.requests.getRewardSplitters({
      options,
      userAddress,
      vaultAddress,
      rewardSplitterAddress,
    })

    if (rewardSplitter) {
      currentShareHolders = rewardSplitter.feeRecipients
    }
    else {
      throw new Error('Reward splitter not found')
    }
  }

  const increaseList: Record<string, bigint> = {}
  const decreaseList: Record<string, bigint> = {}
  const currentShareHolderAddresses = currentShareHolders.map(({ address }) => address.toLowerCase())

  currentShareHolders.forEach(({ address, percent }) => {
    const lowerCasedAddress = address.toLowerCase()
    const feeRecipient = feeRecipients.find((feeRecipient) => feeRecipient.address.toLowerCase() === lowerCasedAddress)

    if (feeRecipient) {
      const newPercent = feeRecipient.percent
      const diff = newPercent - percent

      if (diff > 0n) {
        increaseList[address] = diff
      }
      if (diff < 0n) {
        decreaseList[address] = percent - feeRecipient.percent
      }
    }
    else {
      decreaseList[address] = percent
    }
  })

  feeRecipients.forEach(({ address, percent }) => {
    const isNew = !currentShareHolderAddresses.includes(address.toLowerCase())

    if (isNew) {
      increaseList[address] = percent
    }
  })

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
