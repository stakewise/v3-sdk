import { describe, expect } from 'vitest'

import { it, checksumAddress } from '../../../../test'
import { userInvalidCase } from '../../../../test/mocks/invalidCases'

import type { CheckTxBatchSupportedInput } from './index'


type Input = StakeWise.ExtractInput<CheckTxBatchSupportedInput>

const supported = { atomic: { status: 'supported' } }
const ready = { atomic: { status: 'ready' } }
const unsupported = { atomic: { status: 'unsupported' } }

const resultCases = [
  {
    name: 'supported',
    chainId: '0x1',
    capabilities: { '0x1': supported },
    expected: true,
  },
  {
    name: 'ready',
    chainId: '0x1',
    capabilities: { '0x1': ready },
    expected: true,
  },
  {
    name: 'padded key',
    chainId: '0x1',
    capabilities: { '0x64': unsupported, '0x01': supported },
    expected: true,
  },
  {
    name: 'other chain',
    chainId: '0x1',
    capabilities: { '0x64': supported },
    expected: false,
  },
  {
    name: 'no capabilities',
    chainId: '0x1',
    capabilities: null,
    expected: false,
  },
  {
    name: 'gnosis chain',
    isGnosis: true,
    chainId: '0x64',
    capabilities: { '0x1': supported, '0x64': unsupported },
    expected: false,
  },
]

describe('checkTxBatchSupported', () => {
  it.for(resultCases)('$name', async (resultCase, { sdk, runner, gnosisSdk }) => {
    const {
      chainId,
      expected,
      isGnosis,
      capabilities,
    } = resultCase

    runner.onRpc('wallet_getCapabilities', () => capabilities)

    const batchSdk = isGnosis ? gnosisSdk : sdk
    const rpcCall = { method: 'wallet_getCapabilities', params: [ checksumAddress, [ chainId ] ] }

    const result = await batchSdk.utils.checkTxBatchSupported({ userAddress: checksumAddress })

    expect(result).toBe(expected)
    expect(runner.rpcCalls).toEqual([ rpcCall ])
  })

  it('rpc error', async ({ sdk, runner }) => {
    const rpcCall = { method: 'wallet_getCapabilities', params: [ checksumAddress, [ '0x1' ] ] }

    runner.onRpc('wallet_getCapabilities', () => {
      throw new Error('Method not supported')
    })

    const result = await sdk.utils.checkTxBatchSupported({ userAddress: checksumAddress })

    expect(result).toBe(false)
    expect(runner.rpcCalls).toEqual([ rpcCall ])
  })

  it('invalid user address', async ({ sdk, runner }) => {
    const { input, message } = userInvalidCase

    const request = sdk.utils.checkTxBatchSupported(input as Input)

    await expect(request).rejects.toThrow(message)
    expect(runner.rpcCalls).toHaveLength(0)
  })
})
