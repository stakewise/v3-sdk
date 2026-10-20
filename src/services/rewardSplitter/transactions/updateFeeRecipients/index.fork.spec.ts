import { describe, expect, beforeAll } from 'vitest'
import { Contract, getAddress, parseEther, toQuantity } from 'ethers'

import { it, userAddress, decodeCalls } from '../../../../../test'
import { fork, useForkSdk, parseRewardSplitterCreated } from '../../../../../test/fork'

import type { HarvestParamsQueryPayload } from '../../../../graphql/subgraph/vault'


const vaultAddress = getAddress(fork.vaultAddress)
const keptAddress = '0x3333333333333333333333333333333333333333'
const removedAddress = '0x6666666666666666666666666666666666666666'
const addedAddress = '0x9999999999999999999999999999999999999999'
const holderAddresses = [ keptAddress, removedAddress, addedAddress ]
const rewardSplitterViews = [ 'function sharesOf(address account) view returns (uint256)' ]

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
  const { sdk, provider } = useForkSdk()
  const vaultContract = sdk.contracts.helpers.createVault({ vaultAddress })

  let rewardSplitterAddress = ''

  beforeAll(async () => {
    const adminAddress = await vaultContract.admin()
    const factoryAddress = await sdk.contracts.base.rewardSplitterFactory.getAddress()

    await provider.send('anvil_setBalance', [ adminAddress, toQuantity(parseEther('10')) ])

    const hash = await sdk.rewardSplitter.create({ userAddress, vaultAddress })
    const receipt = await provider.waitForTransaction(hash)

    rewardSplitterAddress = parseRewardSplitterCreated(receipt, factoryAddress).rewardSplitter
  })

  it.for(updateCases)('$name', async (updateCase, { graphql }) => {
    const { canHarvest, oldFeeRecipients, feeRecipients, names, shares } = updateCase

    const canHarvestBefore = await sdk.contracts.base.keeper.canHarvest(vaultAddress)

    expect(canHarvestBefore, 'the harvest state left by the fixture or the previous test').toBe(canHarvest)

    graphql.mock<HarvestParamsQueryPayload>({
      name: 'HarvestParams',
      data: { harvestParams: { ...fork.harvestParams, canHarvest } },
    })

    const adminAddress = await vaultContract.admin()
    const rewardSplitterContract = sdk.contracts.helpers.createRewardSplitter(rewardSplitterAddress)
    const rewardSplitterViewsContract = new Contract(rewardSplitterAddress, rewardSplitterViews, provider)

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
      Promise.all(holderAddresses.map((address) => rewardSplitterViewsContract.sharesOf(address))),
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
