import { describe, expect } from 'vitest'

import { userAddress, subgraphUrl, it as baseIt, vaultAddress, checkHarvestParams } from '../../../test'
import { multicallArgs, multicallNames, multicallParams } from '../../../test/mocks/utilsMulticall'

import type { MulticallRequestInput } from '../../contracts/ownMulticalls/types'


const it = baseIt.extend('vaultCall', ({ sdk, vaultContract }) => {
  const run = ({ params }: MulticallRequestInput) => sdk.utils.getVaultMulticallEncode({
    userAddress,
    vaultAddress,
    vaultContract,
    request: { params },
  })

  return { run, contract: vaultContract }
})

describe('getVaultMulticallEncode', () => {
  it('multicall', async ({ graphql, multicall, vaultCall }) => {
    graphql.mockHarvestParams({ canHarvest: true })

    const harvestCall = { url: subgraphUrl, operationName: 'HarvestParams', variables: { address: vaultAddress } }

    const calls = await multicall.checkTransactionData({
      ...vaultCall,
      params: multicallParams,
      names: multicallNames,
    })
    const [ updateState, ...encodedCalls ] = calls
    const encodedArgs = encodedCalls.map(({ args }) => args.toArray())

    checkHarvestParams(updateState.args[0])
    expect(encodedArgs).toEqual(multicallArgs)
    expect(graphql.calls).toEqual([ expect.objectContaining(harvestCall) ])
  })
})
