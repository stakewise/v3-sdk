import { Interface } from 'ethers'
import type { Signer } from 'ethers'

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

const createContract = (address: string) => ({
  interface: vaultInterface,
  getAddress: jest.fn(async () => address),
}) as unknown as MulticallV3Call['contract']

type Result = {
  success: boolean
  returnData: string
}

const createMulticallContract = (results: Result[]) => {
  const aggregate3 = jest.fn(async () => ({ hash: txHash })) as jest.Mock & { staticCall: jest.Mock }

  aggregate3.staticCall = jest.fn(async () => results)

  const contract = {
    aggregate3,
    connect: jest.fn(() => contract),
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

describe('createMulticallV3', () => {

  it('throws on an empty batch', async () => {
    const contract = createMulticallContract([])
    const multicall = createMulticallV3(contract as unknown as StakeWise.ABI.Multicall)

    await expect(multicall([])).rejects.toThrow('createMulticallV3: empty batch')
    expect(contract.aggregate3.staticCall).not.toHaveBeenCalled()
  })

  it('encodes calls and simulates them with allowFailure enabled', async () => {
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
        callData: vaultInterface.encodeFunctionData('totalAssets', []),
      },
    ])
  })

  it('passes the call arguments to the encoder', async () => {
    const userAddress = '0x4444444444444444444444444444444444444444'
    const contract = createMulticallContract([ success('getPosition', [ 10n, 20n ]) ])
    const multicall = createMulticallV3(contract as unknown as StakeWise.ABI.Multicall)

    await multicall([
      {
        contract: createContract(vaultAddress),
        method: 'getPosition',
        args: [ userAddress ],
      },
    ])

    const [ [ encoded ] ] = contract.aggregate3.staticCall.mock.calls

    expect(encoded[0].callData).toBe(vaultInterface.encodeFunctionData('getPosition', [ userAddress ]))
  })

  it('returns decoded results by returnName', async () => {
    const contract = createMulticallContract([
      success('totalAssets', [ 1000n ]),
      success('getPosition', [ 10n, 20n ]),
    ])
    const multicall = createMulticallV3(contract as unknown as StakeWise.ABI.Multicall)

    const result = await multicall<{ totalAssets: bigint, position: bigint[] }>([
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
    ])

    expect(result.totalAssets).toBe(1000n)
    expect(result.position).toEqual([ 10n, 20n ])
  })

  it('skips calls without returnName', async () => {
    const contract = createMulticallContract([
      success('totalAssets', [ 1000n ]),
      success('totalAssets', [ 2000n ]),
    ])
    const multicall = createMulticallV3(contract as unknown as StakeWise.ABI.Multicall)

    const result = await multicall([
      {
        contract: createContract(vaultAddress),
        method: 'totalAssets',
      },
      {
        contract: createContract(otherVaultAddress),
        method: 'totalAssets',
        returnName: 'otherTotalAssets',
      },
    ])

    expect(result).toEqual({ otherTotalAssets: 2000n })
  })

  it('throws on a duplicate returnName', async () => {
    const contract = createMulticallContract([
      success('totalAssets', [ 1000n ]),
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

    await expect(multicall(calls)).rejects.toThrow('createMulticallV3: duplicate returnName "totalAssets"')
  })

  it('throws on a duplicate returnName holding a falsy value', async () => {
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

    await expect(multicall(calls)).rejects.toThrow('createMulticallV3: duplicate returnName "totalAssets"')
  })

  it('throws with the decoded revert reason of every failed call', async () => {
    const contract = createMulticallContract([
      success('totalAssets', [ 1000n ]),
      failure(),
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
        method: 'updateState',
        args: [ 1n ],
      },
    ]

    await expect(multicall(calls)).rejects.toThrow(
      `Multicall batch failed:\n[1] updateState @ ${otherVaultAddress}: NotHarvested()`
    )
  })

  it('sends the batch and returns the hash when a signer is passed', async () => {
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
        callData: vaultInterface.encodeFunctionData('updateState', [ 1n ]),
      },
    ])
  })

  it('does not send the batch when the simulation fails', async () => {
    const contract = createMulticallContract([ failure() ])
    const multicall = createMulticallV3(contract as unknown as StakeWise.ABI.Multicall, signer)

    const calls: MulticallV3Call[] = [
      {
        contract: createContract(vaultAddress),
        method: 'updateState',
        args: [ 1n ],
      },
    ]

    await expect(multicall(calls)).rejects.toThrow('Multicall batch failed')
    expect(contract.aggregate3).not.toHaveBeenCalled()
  })
})
