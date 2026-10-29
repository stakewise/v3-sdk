import { describe, expect } from 'vitest'
import { parseEther } from 'ethers'

import { it, rpcUrl, apyData, checksumAddress } from '../../../../test'

import { configs, Network } from '../../../helpers'

import fetchLeverageReward from './fetchLeverageReward'
import type { BoostProxyApyDataQueryPayload } from '../../../graphql/subgraph/vault'


const [ primaryUrl ] = configs[Network.Mainnet].api.subgraph

const options = {
  network: Network.Mainnet,
  endpoints: { web3: rpcUrl },
}

const vaultAddress = checksumAddress
const proxyAddress = '0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B'

const activeLeverage = {
  proxy: proxyAddress,
  assets: '0',
  exitingAssets: '0',
  osTokenShares: '0',
  exitingOsTokenShares: '0',
  exitRequest: null,
}

const exitRequest = {
  id: 'exit-1',
  totalAssets: parseEther('3').toString(),
  exitedAssets: parseEther('1').toString(),
}

const activeProxyData = {
  allocators: [
    {
      assets: parseEther('10').toString(),
      mintedOsTokenShares: parseEther('8').toString(),
    },
  ],
  aavePositions: [
    {
      borrowedAssets: parseEther('9').toString(),
    },
  ],
  osTokenExitRequests: [],
}

const pendingExitRequest = {
  osTokenShares: parseEther('2').toString(),
  exitedAssets: null,
}

const processedExitRequest = {
  ...pendingExitRequest,
  exitedAssets: parseEther('3').toString(),
}

const emptyProxyData = {
  allocators: [],
  aavePositions: [],
  osTokenExitRequests: [ pendingExitRequest ],
}

const variables = {
  vaultAddress: vaultAddress.toLowerCase(),
  proxyAddress: proxyAddress.toLowerCase(),
  exitRequestId: '',
}

const exitVariables = { ...variables, exitRequestId: 'exit-1' }

const cases = [
  {
    name: 'active position',
    leverage: activeLeverage,
    proxyData: activeProxyData,
    expected: { reward: parseEther('0.03'), variables },
  },
  {
    name: 'pending exit',
    leverage: { ...activeLeverage, exitRequest },
    proxyData: { ...activeProxyData, osTokenExitRequests: [ pendingExitRequest ] },
    expected: { reward: parseEther('0.085'), variables: exitVariables },
  },
  {
    name: 'processed exit',
    leverage: { ...activeLeverage, exitRequest },
    proxyData: { ...activeProxyData, osTokenExitRequests: [ processedExitRequest ] },
    expected: { reward: parseEther('0.005'), variables: exitVariables },
  },
  {
    name: 'no proxy data',
    leverage: { ...activeLeverage, proxy: '' },
    proxyData: emptyProxyData,
    expected: { reward: parseEther('-0.025'), variables: { ...variables, proxyAddress: '' } },
  },
]

describe('fetchLeverageReward', () => {
  it.for(cases)('$name', async ({ leverage, proxyData, expected }, { graphql }) => {
    graphql.mock<BoostProxyApyDataQueryPayload>({ name: 'BoostProxyApyData', data: proxyData })

    const reward = await fetchLeverageReward({ ...apyData, options, leverage, vaultAddress })

    const request = {
      url: primaryUrl,
      operationName: 'BoostProxyApyData',
      variables: expected.variables,
    }

    expect(reward).toBe(expected.reward)
    expect(graphql.calls).toMatchObject([ request ])
  })
})
