import { describe, expect } from 'vitest'

import {
  userAddress,
  decodeCalls,
  it as baseIt,
  vaultAddress,
  rewardSplitterAddress,
} from '../../../../../test'
import ContractError from '../../../../helpers/wrapErrorHandler/ContractError'
import { baseInputWiringCase } from '../../../../../test/mocks/invalidCases'

import type { ClaimRewardsInput } from './types'


type Input = StakeWise.ExtractInput<ClaimRewardsInput>

const assets = 1_234_567_890_123_456_789n
const shares = 2_469_135_780_246_913_578n
const input = {
  userAddress,
  vaultAddress,
  rewardSplitterAddress,
  assets,
}

const invalidCases = [
  baseInputWiringCase,
  {
    name: 'invalid reward splitter address',
    input: { ...input, rewardSplitterAddress: '0x123' },
    message: 'The "rewardSplitterAddress" argument must be a valid address',
  },
  {
    name: 'missing reward splitter address',
    input: { userAddress, vaultAddress, assets },
    message: 'The "rewardSplitterAddress" argument',
  },
  {
    name: 'invalid assets',
    input: { ...input, assets: '10' },
    message: 'The "assets" argument must be of type bigint',
  },
  {
    name: 'missing assets',
    input: { userAddress, vaultAddress, rewardSplitterAddress },
    message: 'The "assets" argument',
  },
]

const it = baseIt.extend('mockClaimRewards', ({ sdk, runner, graphql, vaultContract }) => (
  () => {
    const rewardSplitterContract = sdk.contracts.helpers.createRewardSplitter(rewardSplitterAddress)

    runner.on(vaultContract, {
      updateState: [],
      convertToShares: ([ amount ]) => [ amount * 2n ],
    })
    runner.on(rewardSplitterContract, {
      syncRewards: [],
      updateVaultState: [],
      enterExitQueue: [ 0n ],
    })

    graphql.mockHarvestParams({ canHarvest: false })

    return rewardSplitterContract
  }
))

describe('claimRewards', () => {
  it('encode', async ({ sdk, mockClaimRewards }) => {
    const rewardSplitterContract = mockClaimRewards()

    const encoded = await sdk.rewardSplitter.claimRewards.encode(input)
    const calls = decodeCalls(rewardSplitterContract, encoded.data)
    const callNames = calls.map(({ name }) => name)
    const callArgs = calls.map(({ args }) => args.toArray())

    expect(encoded.to).toBe(rewardSplitterAddress)
    expect(callNames).toEqual([ 'syncRewards', 'enterExitQueue' ])
    expect(callArgs).toEqual([ [], [ shares, userAddress ] ])
  })

  it('send', async ({ sdk, transaction, mockClaimRewards }) => {
    mockClaimRewards()

    await transaction.checkMulticallSend({ method: sdk.rewardSplitter.claimRewards, input })
  })

  it('estimateGas', async ({ sdk, transaction, mockClaimRewards }) => {
    mockClaimRewards()

    await transaction.checkEstimateGas({ method: sdk.rewardSplitter.claimRewards, input })
  })

  it('wallet rejection', async ({ sdk, runner, mockClaimRewards }) => {
    mockClaimRewards()

    runner.rejectSigning()

    const request = sdk.rewardSplitter.claimRewards(input)

    await expect(request).rejects.toThrow(/rejected/i)
    await expect(request).rejects.toBeInstanceOf(ContractError)
  })

  it.for(invalidCases)('$name', async ({ input: invalidInput, message }, { sdk }) => {
    const request = sdk.rewardSplitter.claimRewards.encode(invalidInput as Input)

    await expect(request).rejects.toThrow(message)
  })
})
