import { describe, expect } from 'vitest'
import { JsonRpcProvider, FallbackProvider } from 'ethers'

import { it, rpcUrl, secondRpcUrl } from '../../../test'

import { Network } from '../enums'

import getReadOnlyProvider from './getReadOnlyProvider'


type FallbackCase = {
  name: string
  method: 'getSigner' | 'send'
  message: string
}

const headers = { 'X-Api-Key': 'test-key' }

const singleCases = [
  {
    name: 'one url',
    network: Network.Mainnet,
    rpc: rpcUrl,
    apiKey: undefined,
  },
  {
    name: 'array of one url',
    network: Network.Gnosis,
    rpc: [ rpcUrl ],
    apiKey: undefined,
  },
  {
    name: 'one url with headers',
    network: Network.Mainnet,
    rpc: [ { url: rpcUrl, headers } ],
    apiKey: 'test-key',
  },
]

const fallbackCases: FallbackCase[] = [
  {
    name: 'getSigner',
    method: 'getSigner',
    message: 'Pass your provider to the SDK class instance to get a signer',
  },
  {
    name: 'send',
    method: 'send',
    message: 'Pass your provider to the SDK class instance to use send method',
  },
]

const getConnection = (provider: unknown) => (provider as JsonRpcProvider)._getConnection()

const getFallbackProvider = (rpc: StakeWise.Web3Endpoints = [ rpcUrl, secondRpcUrl ]) => (
  getReadOnlyProvider({ network: Network.Mainnet, rpc }) as StakeWise.CustomFallbackProvider
)

describe('getReadOnlyProvider', () => {

  it.for(singleCases)('$name', ({ network, rpc, apiKey }) => {
    const provider = getReadOnlyProvider({ network, rpc })
    const connection = getConnection(provider)
    const apiKeyHeader = connection.getHeader('x-api-key')

    expect(provider).toBeInstanceOf(JsonRpcProvider)
    expect(connection.url).toBe(rpcUrl)
    expect(apiKeyHeader).toBe(apiKey)
  })

  it('many urls', () => {
    const provider = getFallbackProvider()

    const priorities = provider.providerConfigs.map(({ priority }) => priority)
    const weights = provider.providerConfigs.map(({ weight }) => weight)
    const urls = provider.providerConfigs.map((config) => getConnection(config.provider).url)

    expect(provider).toBeInstanceOf(FallbackProvider)
    expect(priorities).toEqual([ 1, 2 ])
    expect(weights).toEqual([ 1, 1 ])
    expect(urls).toEqual([ rpcUrl, secondRpcUrl ])
  })

  it('many urls with headers', () => {
    const provider = getFallbackProvider([
      { url: rpcUrl, headers },
      { url: secondRpcUrl, headers: {} },
    ])

    const [ first, second ] = provider.providerConfigs.map((config) => getConnection(config.provider))
    const firstApiKey = first.getHeader('x-api-key')
    const secondApiKey = second.getHeader('x-api-key')

    expect(firstApiKey).toBe('test-key')
    expect(secondApiKey).toBeUndefined()
  })

  it.for(fallbackCases)('$name', ({ method, message }) => {
    const provider = getFallbackProvider()

    const call = () => provider[method]()

    expect(call).toThrow(new Error(message))
  })
})
