import { Interface } from 'ethers'

import decodeRevert from './decodeRevert'
import type { MulticallV3Call } from './types'


const abi = [
  'function totalAssets() view returns (uint256)',
  'error NotHarvested()',
  'error InvalidAmount(uint256 amount, address sender)',
]

const createCall = (contractInterface: unknown): MulticallV3Call => ({
  contract: { interface: contractInterface } as MulticallV3Call['contract'],
  method: 'totalAssets',
})

describe('decodeRevert', () => {

  const contractInterface = new Interface(abi)
  const call = createCall(contractInterface)

  it('returns a hint when revert data is empty', () => {
    const message = 'empty revert data (out of gas or invalid contract address)'

    expect(decodeRevert(call, '')).toBe(message)
    expect(decodeRevert(call, '0x')).toBe(message)
  })

  it('decodes a custom error without arguments', () => {
    const data = contractInterface.encodeErrorResult('NotHarvested', [])

    expect(decodeRevert(call, data)).toBe('NotHarvested()')
  })

  it('decodes a custom error with arguments', () => {
    const sender = '0x1111111111111111111111111111111111111111'
    const data = contractInterface.encodeErrorResult('InvalidAmount', [ 42n, sender ])

    expect(decodeRevert(call, data)).toBe(`InvalidAmount(42, ${sender})`)
  })

  it('decodes a standard Error(string) revert', () => {
    const data = new Interface([]).encodeErrorResult('Error', [ 'insufficient balance' ])

    expect(decodeRevert(call, data)).toBe('Error(insufficient balance)')
  })

  it('returns raw data for an unknown error selector', () => {
    const data = '0x12345678'

    expect(decodeRevert(call, data)).toBe(data)
  })

  it('returns raw data when the interface fails to parse', () => {
    const data = '0xdeadbeef'
    const parseError = jest.fn(() => {
      throw new Error('unable to parse')
    })

    expect(decodeRevert(createCall({ parseError }), data)).toBe(data)
    expect(parseError).toHaveBeenCalledWith(data)
  })

  it('returns raw data when the interface returns no description', () => {
    const data = '0xdeadbeef'
    const parseError = jest.fn(() => null)

    expect(decodeRevert(createCall({ parseError }), data)).toBe(data)
  })
})
