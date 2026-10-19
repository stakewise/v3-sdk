import { describe, expect } from 'vitest'
import { ZeroAddress } from 'ethers'

import {
  it as baseIt,
  userAddress,
  vaultAddress,
  setFeePercent,
  setFeeRecipient,
  checkHarvestParams,
} from '../../../test'

import vaultMulticall from './vaultMulticall'
import type { MulticallRequestInput } from './types'
import type { HarvestInput } from '../../../test'


const deposit = { method: 'deposit', args: [ userAddress, ZeroAddress ] }
const getShares = { method: 'getShares', args: [ userAddress ] }
const mintOsToken = { method: 'mintOsToken', args: [ userAddress, 10n, ZeroAddress ] }
const enterExitQueue = { method: 'enterExitQueue', args: [ 500n, userAddress ] }
const convertToAssets = { method: 'convertToAssets', args: [ 10n ] }
const convertToShares = { method: 'convertToShares', args: [ 20n ] }
const upgradeToAndCall = { method: 'upgradeToAndCall', args: [ userAddress, '0x1234' ] }
const getExitQueueIndex = { method: 'getExitQueueIndex', args: [ 30n ] }
const claimExitedAssets = { method: 'claimExitedAssets', args: [ 1n, 2n, 3n ] }
const withdrawableAssets = { method: 'withdrawableAssets', args: [] }
const calculateExitedAssets = { method: 'calculateExitedAssets', args: [ userAddress, 1n, 2n, 3n ] }
const setMetadata = { method: 'setMetadata', args: [ 'metadata' ] }

const harvestMethods = [
  deposit,
  getShares,
  mintOsToken,
  setFeePercent,
  enterExitQueue,
  setFeeRecipient,
  convertToAssets,
  convertToShares,
  upgradeToAndCall,
  getExitQueueIndex,
  claimExitedAssets,
  withdrawableAssets,
  calculateExitedAssets,
]

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
    params: [ setMetadata ],
    names: [ 'setMetadata' ],
    graphqlCalls: 0,
  },
  {
    name: 'mixed list',
    canHarvest: true,
    params: [ setMetadata, deposit ],
    names: [ 'updateState', 'setMetadata', 'deposit' ],
    graphqlCalls: 1,
  },
]

const it = baseIt.extend('mockVaultMulticall', ({ sdk, runner, graphql, vaultContract }) => (
  (values: HarvestInput = {}) => {
    const { canHarvest = false } = values

    runner.on(vaultContract, {
      deposit: [ 7n ],
      updateState: [],
      setMetadata: [],
      convertToShares: [ 5n ],
    })

    graphql.mockHarvestParams({ canHarvest })

    const run = (request: MulticallRequestInput) => vaultMulticall({
      ...sdk.vault.params,
      vaultAddress,
      userAddress,
      vaultContract,
      request,
    })

    return { run, contract: vaultContract }
  }
))

describe('vaultMulticall', () => {

  it.for(harvestMethods)('harvest $method', async (param, { graphql, multicall, mockVaultMulticall }) => {
    const vaultCall = mockVaultMulticall({ canHarvest: true })

    const calls = await multicall.checkTransactionData({
      ...vaultCall,
      params: [ param ],
      names: [ 'updateState', param.method ],
    })
    const [ harvestParams ] = calls[0].args
    const harvestRequest = {
      operationName: 'HarvestParams',
      variables: { address: vaultAddress.toLowerCase() },
    }

    checkHarvestParams(harvestParams)
    expect(graphql.calls).toEqual([ expect.objectContaining(harvestRequest) ])
  })

  it.for(listCases)('$name', async (listCase, { graphql, multicall, mockVaultMulticall }) => {
    const { canHarvest, params, names, graphqlCalls } = listCase
    const vaultCall = mockVaultMulticall({ canHarvest })

    await multicall.checkTransactionData({ ...vaultCall, params, names })

    expect(graphql.calls).toHaveLength(graphqlCalls)
  })

  it('send', async ({ multicall, mockVaultMulticall }) => {
    const vaultCall = mockVaultMulticall({ canHarvest: true })

    await multicall.checkSend({
      ...vaultCall,
      params: [ deposit ],
      names: [ 'updateState', 'deposit' ],
    })
  })

  it('estimateGas', async ({ multicall, mockVaultMulticall }) => {
    const vaultCall = mockVaultMulticall()

    await multicall.checkEstimateGas({ ...vaultCall, params: [ setMetadata ], names: [ 'setMetadata' ] })
  })

  it('callStatic', async ({ multicall, mockVaultMulticall }) => {
    const vaultCall = mockVaultMulticall({ canHarvest: true })

    await multicall.checkCallStatic({ ...vaultCall, params: [ convertToShares ], values: [ [ 5n ] ] })
  })
})
