import { describe, expect, vi } from 'vitest'
import type { Mock } from 'vitest'
import { Interface } from 'ethers'
import type { Signer } from 'ethers'

import { it } from '../../../test'

import createMulticallV3 from './index'
import type { MulticallV3Call } from './types'


const abi = [
  'function totalAssets() view returns (uint256)',
  'function getPosition(address user) view returns (uint256 shares, uint256 assets)',
  'function updateState(uint256 value)',
  'error NotHarvested()',
]

const vaultInterface = new Interface(abi)

const vaultAddress = '0x1111111111111111111111111111111111111111'
const otherVaultAddress = '0x2222222222222222222222222222222222222222'
const txHash = '0x3333333333333333333333333333333333333333333333333333333333333333'

const totalAssetsData = vaultInterface.encodeFunctionData('totalAssets', [])
const updateStateData = vaultInterface.encodeFunctionData('updateState', [ 1n ])

const createContract = (address: string) => ({
  interface: vaultInterface,
  getAddress: vi.fn(async () => address),
}) as unknown as MulticallV3Call['contract']

type Result = {
  success: boolean
  returnData: string
}

type MulticallContract = {
  connect: Mock
  aggregate3: Mock & { staticCall: Mock }
}

type ResultCase = {
  name: string
  results: Result[]
  calls: MulticallV3Call[]
  expected: Record<string, unknown>
}

const createMulticallContract = (results: Result[]): MulticallContract => {
  const aggregate3 = vi.fn(async () => ({ hash: txHash })) as MulticallContract['aggregate3']

  aggregate3.staticCall = vi.fn(async () => results)

  const contract: MulticallContract = {
    aggregate3,
    connect: vi.fn(() => contract),
  }

  return contract
}

const success = (method: string, values: unknown[]): Result => ({
  success: true,
  returnData: vaultInterface.encodeFunctionResult(method, values),
})

const failure = (): Result => ({
  success: false,
  returnData: vaultInterface.encodeErrorResult('NotHarvested', []),
})

const signer = {} as Signer

const resultCases: ResultCase[] = [
  {
    name: 'by returnName',
    results: [
      success('totalAssets', [ 1000n ]),
      success('getPosition', [ 10n, 20n ]),
    ],
    calls: [
      {
        contract: createContract(vaultAddress),
        method: 'totalAssets',
        returnName: 'totalAssets',
      },
      {
        contract: createContract(otherVaultAddress),
        method: 'getPosition',
        args: [ vaultAddress ],
        returnName: 'position',
      },
    ],
    expected: { totalAssets: 1000n, position: [ 10n, 20n ] },
  },
  {
    name: 'without returnName',
    results: [
      success('totalAssets', [ 1000n ]),
      success('totalAssets', [ 2000n ]),
    ],
    calls: [
      {
        contract: createContract(vaultAddress),
        method: 'totalAssets',
      },
      {
        contract: createContract(otherVaultAddress),
        method: 'totalAssets',
        returnName: 'otherTotalAssets',
      },
    ],
    expected: { otherTotalAssets: 2000n },
  },
  {
    name: 'allowed failure',
    results: [
      success('totalAssets', [ 1000n ]),
      failure(),
    ],
    calls: [
      {
        contract: createContract(vaultAddress),
        method: 'totalAssets',
        returnName: 'totalAssets',
      },
      {
        contract: createContract(otherVaultAddress),
        method: 'totalAssets',
        returnName: 'otherTotalAssets',
        allowFailure: true,
      },
    ],
    expected: { totalAssets: 1000n },
  },
]

describe('createMulticallV3', () => {

  it('empty batch', async () => {
    const contract = createMulticallContract([])
    const multicall = createMulticallV3(contract as unknown as StakeWise.ABI.Multicall)

    const request = multicall([])

    await expect(request).rejects.toThrow('createMulticallV3: empty batch')
    expect(contract.aggregate3.staticCall).not.toHaveBeenCalled()
  })

  it('simulate', async () => {
    const contract = createMulticallContract([ success('totalAssets', [ 1000n ]) ])
    const multicall = createMulticallV3(contract as unknown as StakeWise.ABI.Multicall)

    await multicall([
      {
        contract: createContract(vaultAddress),
        method: 'totalAssets',
        returnName: 'totalAssets',
      },
    ])

    expect(contract.connect).not.toHaveBeenCalled()
    expect(contract.aggregate3.staticCall).toHaveBeenCalledWith([
      {
        target: vaultAddress,
        allowFailure: true,
        callData: totalAssetsData,
      },
    ])
  })

  it.for(resultCases)('$name', async ({ results, calls, expected }) => {
    const contract = createMulticallContract(results)
    const multicall = createMulticallV3(contract as unknown as StakeWise.ABI.Multicall)

    const result = await multicall(calls)

    expect(result).toEqual(expected)
  })

  it('duplicate returnName', async () => {
    const contract = createMulticallContract([
      success('totalAssets', [ 0n ]),
      success('totalAssets', [ 2000n ]),
    ])
    const multicall = createMulticallV3(contract as unknown as StakeWise.ABI.Multicall)

    const calls: MulticallV3Call[] = [
      {
        contract: createContract(vaultAddress),
        method: 'totalAssets',
        returnName: 'totalAssets',
      },
      {
        contract: createContract(otherVaultAddress),
        method: 'totalAssets',
        returnName: 'totalAssets',
      },
    ]

    const request = multicall(calls)

    await expect(request).rejects.toThrow('createMulticallV3: duplicate returnName "totalAssets"')
  })

  it('send with signer', async () => {
    const contract = createMulticallContract([ success('totalAssets', [ 1000n ]) ])
    const multicall = createMulticallV3(contract as unknown as StakeWise.ABI.Multicall, signer)

    const hash = await multicall([
      {
        contract: createContract(vaultAddress),
        method: 'updateState',
        args: [ 1n ],
      },
    ])

    expect(hash).toBe(txHash)
    expect(contract.connect).toHaveBeenCalledWith(signer)
    expect(contract.aggregate3.staticCall).toHaveBeenCalledTimes(1)
    expect(contract.aggregate3).toHaveBeenCalledWith([
      {
        target: vaultAddress,
        allowFailure: false,
        callData: updateStateData,
      },
    ])
  })

  it('forward allowFailure', async () => {
    const contract = createMulticallContract([ failure() ])
    const multicall = createMulticallV3(contract as unknown as StakeWise.ABI.Multicall, signer)

    const hash = await multicall([
      {
        contract: createContract(vaultAddress),
        method: 'updateState',
        args: [ 1n ],
        allowFailure: true,
      },
    ])

    expect(hash).toBe(txHash)
    expect(contract.aggregate3).toHaveBeenCalledWith([
      {
        target: vaultAddress,
        allowFailure: true,
        callData: updateStateData,
      },
    ])
  })

  it('failure not allowed', async () => {
    const contract = createMulticallContract([ failure(), failure() ])
    const multicall = createMulticallV3(contract as unknown as StakeWise.ABI.Multicall, signer)

    const calls: MulticallV3Call[] = [
      {
        contract: createContract(vaultAddress),
        method: 'updateState',
        args: [ 1n ],
        allowFailure: true,
      },
      {
        contract: createContract(otherVaultAddress),
        method: 'updateState',
        args: [ 2n ],
      },
    ]
    const message = `Multicall batch failed:\n[1] updateState @ ${otherVaultAddress}: NotHarvested()`

    const request = multicall(calls)

    await expect(request).rejects.toThrow(message)
    expect(contract.aggregate3).not.toHaveBeenCalled()
  })
})
