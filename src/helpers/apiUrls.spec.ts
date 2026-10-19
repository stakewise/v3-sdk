import { describe, expect } from 'vitest'

import { it, rpcUrl } from '../../test'

import apiUrls from './apiUrls'
import configs from './configs'
import { Network } from './enums'


const api = 'https://api.example.test/graphql'
const subgraph = 'https://subgraph.example.test/graphql'

const getOptions = (network: Network, endpoints: Partial<StakeWise.Options['endpoints']> = {}) => ({
  network,
  endpoints: { web3: rpcUrl, ...endpoints },
})

const backendCases = [
  {
    name: 'backend mainnet',
    network: Network.Mainnet,
    endpoints: {},
    expected: configs[Network.Mainnet].api.backend,
  },
  {
    name: 'backend gnosis',
    network: Network.Gnosis,
    endpoints: {},
    expected: configs[Network.Gnosis].api.backend,
  },
  {
    name: 'backend endpoint',
    network: Network.Mainnet,
    endpoints: { api },
    expected: api,
  },
]

const subgraphCases = [
  {
    name: 'subgraph mainnet',
    network: Network.Mainnet,
    endpoints: {},
    expected: configs[Network.Mainnet].api.subgraph,
  },
  {
    name: 'subgraph gnosis',
    network: Network.Gnosis,
    endpoints: {},
    expected: configs[Network.Gnosis].api.subgraph,
  },
  {
    name: 'subgraph endpoint',
    network: Network.Mainnet,
    endpoints: { subgraph },
    expected: subgraph,
  },
  {
    name: 'subgraph endpoints',
    network: Network.Mainnet,
    endpoints: { subgraph: [ subgraph, api ] },
    expected: [ subgraph, api ],
  },
]

describe('apiUrls', () => {

  it.for(backendCases)('$name', ({ network, endpoints, expected }) => {
    const url = apiUrls.getBackendUrl(getOptions(network, endpoints))

    expect(url).toEqual(expected)
  })

  it.for(subgraphCases)('$name', ({ network, endpoints, expected }) => {
    const url = apiUrls.getSubgraphqlUrl(getOptions(network, endpoints))

    expect(url).toEqual(expected)
  })
})
