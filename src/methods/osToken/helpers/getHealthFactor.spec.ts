import { OsTokenPositionHealth } from 'helpers'

import getHealthFactor from './getHealthFactor'


describe('getHealthFactor function', () => {

  it('should return a health of Healthy when healthFactor is >= 1.02', async () => {
    const input = {
      mintedAssets: 1000n,
      stakedAssets: 1020n,
      thresholdPercent: 10000n,
    }

    const result = await getHealthFactor(input)

    expect(result).toEqual({
      value: 1.02,
      health: OsTokenPositionHealth.Healthy,
    })
  })

  it('should return a health of Moderate when healthFactor is >= 1.01 and < 1.02', async () => {
    const input = {
      mintedAssets: 1000n,
      stakedAssets: 1015n,
      thresholdPercent: 10000n,
    }

    const result = await getHealthFactor(input)

    expect(result).toEqual({
      value: 1.015,
      health: OsTokenPositionHealth.Moderate,
    })
  })

  it('should return a health of Risky when healthFactor is >= 1.00 and < 1.01', async () => {
    const input = {
      mintedAssets: 1000n,
      stakedAssets: 1005n,
      thresholdPercent: 10000n,
    }

    const result = await getHealthFactor(input)

    expect(result).toEqual({
      value: 1.005,
      health: OsTokenPositionHealth.Risky,
    })
  })

  it('should return a health of Unhealthy when healthFactor is < 1.00', async () => {
    const input = {
      mintedAssets: 1000n,
      stakedAssets: 995n,
      thresholdPercent: 10000n,
    }

    const result = await getHealthFactor(input)

    expect(result).toEqual({
      value: 0.995,
      health: OsTokenPositionHealth.Unhealthy,
    })
  })

  it('should return a health of Healthy and a value of 0 when mintedAssets or stakedAssets is 0', async () => {
    const input1 = {
      mintedAssets: 0n,
      stakedAssets: 1000n,
      thresholdPercent: 10000n,
    }
    const input2 = {
      mintedAssets: 1000n,
      stakedAssets: 0n,
      thresholdPercent: 10000n,
    }

    const result1 = await getHealthFactor(input1)
    const result2 = await getHealthFactor(input2)

    expect(result1).toEqual({
      value: 0,
      health: OsTokenPositionHealth.Healthy,
    })
    expect(result2).toEqual({
      value: 0,
      health: OsTokenPositionHealth.Healthy,
    })
  })
})
