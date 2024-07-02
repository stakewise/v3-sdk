import { MulticallAbi } from '../types'

import multicall from './commonMulticall'


describe('multicall function', () => {
  let mockMulticallContract: jest.Mocked<MulticallAbi>

  beforeEach(() => {
    mockMulticallContract = {
      aggregate: jest.fn(async () => ({
        blockNumber: 0n,
        returnData: [ '0x' ],
      })),
    } as unknown as jest.Mocked<MulticallAbi>
  })

  it('should handle mock values correctly', async () => {
    const multicallFunction = multicall(mockMulticallContract)

    const result = await multicallFunction([
      {
        args: [],
        contract: null,
        methodName: '',
        returnName: 'mockReturnName',
        noContractValue: 'noContractValue',
        mock: 'mockValue',
      },
    ])()

    expect(result).toEqual({
      mockReturnName: 'mockValue',
    })
  })

  it('should handle noContractValue correctly', async () => {
    const multicallFunction = multicall(mockMulticallContract)

    const result = await multicallFunction([
      {
        args: [],
        contract: null,
        methodName: '',
        returnName: 'noContractReturnName',
        noContractValue: 'noContractValue',
      },
    ])()

    expect(result).toEqual({
      noContractReturnName: 'noContractValue',
    })
  })
})
