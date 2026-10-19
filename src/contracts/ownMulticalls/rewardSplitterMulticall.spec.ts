import { describe, expect } from 'vitest'

import { userAddress, it as baseIt, vaultAddress, checkHarvestParams } from '../../../test'

import rewardSplitterMulticall from './rewardSplitterMulticall'
import type { MulticallRequestInput } from './types'
import type { HarvestInput } from '../../../test'


const rewardSplitterAddress = '0x5555555555555555555555555555555555555555'

const syncRewards = { method: 'syncRewards', args: [] }
const enterExitQueue = { method: 'enterExitQueue', args: [ 10n, userAddress ] }

const it = baseIt.extend('mockRewardSplitterMulticall', ({ sdk, runner, graphql }) => (
  (values: HarvestInput = {}) => {
    const { canHarvest = false } = values
    const rewardSplitterContract = sdk.contracts.helpers.createRewardSplitter(rewardSplitterAddress)

    runner.on(rewardSplitterContract, {
      syncRewards: [],
      updateVaultState: [],
      enterExitQueue: [ 7n ],
    })

    graphql.mockHarvestParams({ canHarvest })

    const run = (request: MulticallRequestInput) => rewardSplitterMulticall({
      ...sdk.rewardSplitter.params,
      vaultAddress,
      userAddress,
      rewardSplitterContract,
      request,
    })

    return { run, contract: rewardSplitterContract }
  }
))

describe('rewardSplitterMulticall', () => {

  it('with harvest', async ({ graphql, multicall, mockRewardSplitterMulticall }) => {
    const rewardSplitterCall = mockRewardSplitterMulticall({ canHarvest: true })

    const calls = await multicall.checkTransactionData({
      ...rewardSplitterCall,
      params: [ syncRewards, enterExitQueue ],
      names: [ 'updateVaultState', 'syncRewards', 'enterExitQueue' ],
    })
    const [ harvestParams ] = calls[0].args

    checkHarvestParams(harvestParams)
    expect(graphql.calls).toHaveLength(1)
  })

  it('cannot harvest', async ({ multicall, mockRewardSplitterMulticall }) => {
    const rewardSplitterCall = mockRewardSplitterMulticall({ canHarvest: false })

    await multicall.checkTransactionData({ ...rewardSplitterCall, params: [ syncRewards ], names: [ 'syncRewards' ] })
  })

  it('send', async ({ multicall, mockRewardSplitterMulticall }) => {
    const rewardSplitterCall = mockRewardSplitterMulticall({ canHarvest: true })

    await multicall.checkSend({
      ...rewardSplitterCall,
      params: [ syncRewards, enterExitQueue ],
      names: [ 'updateVaultState', 'syncRewards', 'enterExitQueue' ],
    })
  })

  it('estimateGas', async ({ multicall, mockRewardSplitterMulticall }) => {
    const rewardSplitterCall = mockRewardSplitterMulticall()

    await multicall.checkEstimateGas({ ...rewardSplitterCall, params: [ syncRewards ], names: [ 'syncRewards' ] })
  })

  it('callStatic', async ({ multicall, mockRewardSplitterMulticall }) => {
    const rewardSplitterCall = mockRewardSplitterMulticall({ canHarvest: true })

    await multicall.checkCallStatic({
      ...rewardSplitterCall,
      params: [ syncRewards, enterExitQueue ],
      values: [ [], [ 7n ] ],
    })
  })
})
