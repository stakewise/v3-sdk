import { describe, expect } from 'vitest'

import { it } from '../../../../../test'


describe('getOsTokenRate', () => {
  it('returns rate', async ({ sdk, runner }) => {
    const priceOracleContract = sdk.contracts.base.priceOracle

    runner.on(priceOracleContract, { latestAnswer: [ 1_052_345_678_901_234_567n ] })

    const rate = await sdk.osToken.getRate()

    expect(rate).toBe('1.052345678901234567')
  })
})
