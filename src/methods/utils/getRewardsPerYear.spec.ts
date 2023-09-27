import { constants, BigDecimal } from 'helpers'

import getRewardsPerYear from './getRewardsPerYear'


const secondsInYear = BigInt(constants.blockchain.secondsInYear)

describe('getRewardsPerYear', () => {

  it('should calculate correct rewards for a given amount and average rewards per second', async () => {
    const input = {
      amount: 1000n,
      averageRewardsPerSecond: 10n,
    }

    const expectedReward = new BigDecimal(input.amount)
      .multiply(input.averageRewardsPerSecond)
      .multiply(secondsInYear)
      .divide(constants.blockchain.amount1)
      .decimals(18)
      .toString()

    const result = await getRewardsPerYear(input)

    expect(result).toBe(expectedReward)
  })

  it('should return zero rewards for zero amount', async () => {
    const input = {
      amount: 0n,
      averageRewardsPerSecond: 10n,
    }

    const result = await getRewardsPerYear(input)

    expect(result).toBe('0')
  })

  it('should return zero rewards for zero average rewards per second', async () => {
    const input = {
      amount: 1000n,
      averageRewardsPerSecond: 0n,
    }

    const result = await getRewardsPerYear(input)

    expect(result).toBe('0')
  })

  it('should handle large values correctly', async () => {
    const input = {
      amount: 1000000000000000000000n,
      averageRewardsPerSecond: 1000000000000000000n,
    }

    const expectedReward = new BigDecimal(input.amount)
      .multiply(input.averageRewardsPerSecond)
      .multiply(secondsInYear)
      .divide(constants.blockchain.amount1)
      .decimals(18)
      .toString()

    const result = await getRewardsPerYear(input)

    expect(result).toBe(expectedReward)
  })
})


