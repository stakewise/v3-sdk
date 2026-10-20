import { describe, expect } from 'vitest'
import { getAddress, parseEther } from 'ethers'

import { it, userAddress, decodeCalls } from '../../../../../test'
import {
  fork,
  forkAbis,
  useForkSdk,
  parseEvents,
  extendContract,
  fundVaultAdmin,
  mockForkHarvestParams,
} from '../../../../../test/fork'

import type { Fork } from '../../../../../test/fork'


type FeeRecipient = {
  address: string
  shares: bigint
}

const vaultAddress = getAddress(fork.vaultAddress)
const keptAddress = '0x3333333333333333333333333333333333333333'
const removedAddress = '0x6666666666666666666666666666666666666666'
const addedAddress = '0x9999999999999999999999999999999999999999'
const holderAddresses = [ keptAddress, removedAddress, addedAddress ]

const initialRecipients = [
  { address: keptAddress, shares: parseEther('30') },
  { address: removedAddress, shares: parseEther('70') },
]

const updatedRecipients = [
  { address: keptAddress, shares: parseEther('50') },
  { address: addedAddress, shares: parseEther('20') },
]

const updateCases = [
  {
    name: 'with harvest',
    canHarvest: true,
    oldFeeRecipients: [],
    feeRecipients: initialRecipients,
    names: [ 'updateVaultState', 'increaseShares', 'increaseShares' ],
    shares: [ parseEther('30'), parseEther('70'), 0n ],
  },
  {
    name: 'without harvest',
    canHarvest: false,
    oldFeeRecipients: initialRecipients,
    feeRecipients: updatedRecipients,
    names: [ 'increaseShares', 'increaseShares', 'decreaseShares' ],
    shares: [ parseEther('50'), 0n, parseEther('20') ],
  },
]

describe('updateFeeRecipients', () => {
  let adminAddress = ''
  let rewardSplitterAddress = ''

  const createRewardSplitter = async (setupFork: Fork) => {
    const { sdk, provider } = setupFork
    const factoryContract = extendContract(sdk.contracts.base.rewardSplitterFactory, forkAbis.rewardSplitterFactory)

    adminAddress = await fundVaultAdmin(setupFork)

    const hash = await sdk.rewardSplitter.create({ userAddress, vaultAddress })
    const receipt = await provider.waitForTransaction(hash)
    const [ created ] = await parseEvents(factoryContract, receipt)

    rewardSplitterAddress = created!.args.rewardSplitter
  }

  const { sdk, provider } = useForkSdk(createRewardSplitter)

  const setRecipients = async (feeRecipients: FeeRecipient[]) => {
    if (feeRecipients.length === 0) {
      return
    }

    mockForkHarvestParams(true)

    const hash = await sdk.rewardSplitter.updateFeeRecipients({
      vaultAddress,
      feeRecipients,
      oldFeeRecipients: [],
      rewardSplitterAddress,
      userAddress: adminAddress,
    })

    await provider.waitForTransaction(hash)
  }

  it.for(updateCases)('$name', async (updateCase) => {
    const { canHarvest, oldFeeRecipients, feeRecipients, names, shares } = updateCase

    await setRecipients(oldFeeRecipients)

    mockForkHarvestParams(canHarvest)

    const rewardSplitterContract = extendContract(
      sdk.contracts.helpers.createRewardSplitter(rewardSplitterAddress),
      forkAbis.rewardSplitter
    )

    const input = {
      userAddress: adminAddress,
      vaultAddress,
      rewardSplitterAddress,
      feeRecipients,
      oldFeeRecipients,
    }

    const [ encoded, gas ] = await Promise.all([
      sdk.rewardSplitter.updateFeeRecipients.encode(input),
      sdk.rewardSplitter.updateFeeRecipients.estimateGas(input),
    ])

    const hash = await sdk.rewardSplitter.updateFeeRecipients(input)

    const [ receipt, sentTx, canHarvestAfter, sharesAfter ] = await Promise.all([
      provider.waitForTransaction(hash),
      provider.getTransaction(hash),
      sdk.contracts.base.keeper.canHarvest(vaultAddress),
      Promise.all(holderAddresses.map((address) => rewardSplitterContract.sharesOf(address))),
    ])

    const callNames = decodeCalls(rewardSplitterContract, encoded.data).map(({ name }) => name)

    expect(callNames).toEqual(names)
    expect(gas).toBeGreaterThan(0n)
    expect(sentTx?.data).toBe(encoded.data)
    expect(receipt?.status).toBe(1)
    expect(canHarvestAfter).toBe(false)
    expect(sharesAfter).toEqual(shares)
  })
})
