import { describe, expect, vi, afterEach } from 'vitest'
import { JsonRpcProvider, Network as EthersNetwork } from 'ethers'

import {
  it,
  rpcUrl,
  userAddress,
  secondRpcUrl,
  spenderAddress,
  providerRequiredMessage,
} from '../../../test'

import { Network } from '../enums'

import createProvider from './index'


const signerCases = [
  { name: 'first account', address: undefined, expected: spenderAddress },
  { name: 'passed address', address: userAddress, expected: userAddress },
]

describe('createProvider', () => {

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('passed provider', ({ runner }) => {
    const provider = createProvider({ network: Network.Mainnet, rpc: rpcUrl, provider: runner.provider })

    expect(provider).toBe(runner.provider)
  })

  it('read-only provider', () => {
    const provider = createProvider({ network: Network.Mainnet, rpc: rpcUrl })

    expect(provider).toBeInstanceOf(JsonRpcProvider)
  })

  it.for(signerCases)('getSigner $name', async ({ address, expected }) => {
    const provider = createProvider({ network: Network.Mainnet, rpc: rpcUrl })
    const network = EthersNetwork.from(Network.Mainnet)

    vi.spyOn(provider, 'getNetwork').mockResolvedValue(network)
    vi.spyOn(provider, 'send').mockResolvedValue([ spenderAddress, userAddress ])

    const signer = await provider.getSigner(address)
    const signerAddress = await signer.getAddress()

    expect(signerAddress).toBe(expected)
  })

  it('getSigner error', async () => {
    const original = new Error('no accounts')
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
    const provider = createProvider({ network: Network.Mainnet, rpc: rpcUrl })

    vi.spyOn(provider, 'send').mockRejectedValue(original)

    const request = provider.getSigner()

    await expect(request).rejects.toThrow(new Error(providerRequiredMessage))
    expect(consoleError).toHaveBeenCalledWith('getSigner err:', original)
  })

  it('fallback getSigner', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
    const provider = createProvider({ network: Network.Mainnet, rpc: [ rpcUrl, secondRpcUrl ] })

    const request = provider.getSigner(userAddress)

    await expect(request).rejects.toThrow(new Error(providerRequiredMessage))
    expect(consoleError).toHaveBeenCalledWith('getSigner err:', expect.objectContaining({
      message: 'Pass your provider to the SDK class instance to get a signer',
    }))
  })
})
