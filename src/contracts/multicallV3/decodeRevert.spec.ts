import { describe, expect } from 'vitest'
import { Interface } from 'ethers'

import { it } from '../../../test'

import decodeRevert from './decodeRevert'
import type { MulticallV3Call } from './types'


const abi = [
  'function totalAssets() view returns (uint256)',
  'error NotHarvested()',
  'error InvalidAmount(uint256 amount, address sender)',
]

const sender = '0x1111111111111111111111111111111111111111'
const unknownData = '0x12345678'
const emptyHint = 'empty revert data (out of gas or invalid contract address)'

const contractInterface = new Interface(abi)

const call: MulticallV3Call = {
  contract: { interface: contractInterface } as MulticallV3Call['contract'],
  method: 'totalAssets',
}

const invalidAmountData = contractInterface.encodeErrorResult('InvalidAmount', [ 42n, sender ])

const cases = [
  {
    name: 'error without arguments',
    data: contractInterface.encodeErrorResult('NotHarvested', []),
    expected: 'NotHarvested()',
  },
  {
    name: 'error with arguments',
    data: invalidAmountData,
    expected: `InvalidAmount(42, ${sender})`,
  },
  {
    name: 'Error string revert',
    data: new Interface([]).encodeErrorResult('Error', [ 'insufficient balance' ]),
    expected: 'Error(insufficient balance)',
  },
  {
    name: 'unknown selector',
    data: unknownData,
    expected: unknownData,
  },
  {
    name: 'malformed error data',
    data: invalidAmountData.slice(0, 20),
    expected: invalidAmountData.slice(0, 20),
  },
]

describe('decodeRevert', () => {

  it('empty data', () => {
    const emptyResult = decodeRevert(call, '')
    const prefixResult = decodeRevert(call, '0x')

    expect(emptyResult).toBe(emptyHint)
    expect(prefixResult).toBe(emptyHint)
  })

  it.for(cases)('$name', ({ data, expected }) => {
    const result = decodeRevert(call, data)

    expect(result).toBe(expected)
  })
})
