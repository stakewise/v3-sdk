import { describe, expect } from 'vitest'
import { ZeroAddress } from 'ethers'

import { userAddress, it as baseIt, vaultAddress, checkHarvestParams } from '../../../test'

import boostMulticall from './boostMulticall'
import type { MulticallRequestInput } from './types'
import type { HarvestInput } from '../../../test'


const deposit = { method: 'deposit', args: [ vaultAddress, 10n, ZeroAddress ] }
const enterExitQueue = { method: 'enterExitQueue', args: [ vaultAddress, 500n ] }
const claimExitedAssets = { method: 'claimExitedAssets', args: [ vaultAddress, userAddress, [ 1n, 2n, 3n ] ] }
const upgradeProxy = { method: 'upgradeProxy', args: [ vaultAddress ] }

const harvestMethods = [ deposit, enterExitQueue, claimExitedAssets ]

const listCases = [
  {
    name: 'cannot harvest',
    canHarvest: false,
    params: [ deposit ],
    names: [ 'deposit' ],
    graphqlCalls: 1,
  },
  {
    name: 'outside harvest list',
    canHarvest: true,
    params: [ upgradeProxy ],
    names: [ 'upgradeProxy' ],
    graphqlCalls: 0,
  },
  {
    name: 'mixed list',
    canHarvest: true,
    params: [ upgradeProxy, deposit ],
    names: [ 'updateVaultState', 'upgradeProxy', 'deposit' ],
    graphqlCalls: 1,
  },
]

const it = baseIt.extend('mockBoostMulticall', ({ sdk, runner, graphql }) => (
  (values: HarvestInput = {}) => {
    const { canHarvest = false } = values
    const leverageStrategyContract = sdk.contracts.special.leverageStrategy

    runner.on(leverageStrategyContract, {
      upgradeProxy: [],
      updateVaultState: [],
      enterExitQueue: [ 7n ],
    })

    graphql.mockHarvestParams({ canHarvest })

    const run = (request: MulticallRequestInput) => boostMulticall({
      ...sdk.boost.params,
      vaultAddress,
      userAddress,
      leverageStrategyContract,
      request,
    })

    return { run, contract: leverageStrategyContract }
  }
))

describe('boostMulticall', () => {

  it.for(harvestMethods)('harvest $method', async (param, { multicall, mockBoostMulticall }) => {
    const boostCall = mockBoostMulticall({ canHarvest: true })

    const calls = await multicall.checkTransactionData({
      ...boostCall,
      params: [ param ],
      names: [ 'updateVaultState', param.method ],
    })
    const [ vault, harvestParams ] = calls[0].args

    expect(vault).toBe(vaultAddress)
    checkHarvestParams(harvestParams)
  })

  it.for(listCases)('$name', async (listCase, { graphql, multicall, mockBoostMulticall }) => {
    const { canHarvest, params, names, graphqlCalls } = listCase
    const boostCall = mockBoostMulticall({ canHarvest })

    await multicall.checkTransactionData({ ...boostCall, params, names })

    expect(graphql.calls).toHaveLength(graphqlCalls)
  })

  it('send', async ({ multicall, mockBoostMulticall }) => {
    const boostCall = mockBoostMulticall({ canHarvest: true })

    await multicall.checkSend({
      ...boostCall,
      params: [ enterExitQueue ],
      names: [ 'updateVaultState', 'enterExitQueue' ],
    })
  })

  it('estimateGas', async ({ multicall, mockBoostMulticall }) => {
    const boostCall = mockBoostMulticall()

    await multicall.checkEstimateGas({ ...boostCall, params: [ upgradeProxy ], names: [ 'upgradeProxy' ] })
  })

  it('callStatic', async ({ multicall, mockBoostMulticall }) => {
    const boostCall = mockBoostMulticall({ canHarvest: true })

    await multicall.checkCallStatic({ ...boostCall, params: [ enterExitQueue ], values: [ [ 7n ] ] })
  })
})
