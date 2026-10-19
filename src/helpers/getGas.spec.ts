import { describe, expect } from 'vitest'

import { it } from '../../test'

import getGas from './getGas'


const gasUnits = 21_000n

describe('getGas', () => {

  it('EIP-1559', async ({ runner }) => {
    runner.setBaseFee(7n)
    runner.setFeeData({ gasPrice: 5n, maxFeePerGas: 20n, maxPriorityFeePerGas: 3n })

    const gas = await getGas({ provider: runner.provider, estimatedGas: gasUnits })

    expect(gas).toBe(gasUnits * 10n)
  })

  it('partial fee data', async ({ runner }) => {
    runner.setBaseFee(7n)
    runner.setFeeData({ gasPrice: 5n, maxFeePerGas: 20n, maxPriorityFeePerGas: null })

    const gas = await getGas({ provider: runner.provider, estimatedGas: gasUnits })

    expect(gas).toBe(gasUnits * 5n)
  })

  it('without block', async () => {
    const getFeeData = async () => ({ gasPrice: 2n, maxFeePerGas: 20n, maxPriorityFeePerGas: 4n })
    const provider = { getFeeData, getBlock: async () => null } as unknown as StakeWise.Provider

    const gas = await getGas({ provider, estimatedGas: gasUnits })

    expect(gas).toBe(gasUnits * 4n)
  })

  it('invalid gas', async ({ runner }) => {
    const request = getGas({ provider: runner.provider, estimatedGas: 21_000 as unknown as bigint })

    await expect(request).rejects.toThrow('The "estimatedGas" argument must be of type bigint')
  })
})
