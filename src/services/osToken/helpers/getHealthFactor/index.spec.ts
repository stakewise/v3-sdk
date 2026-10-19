import { describe, expect } from 'vitest'

import { OsTokenPositionHealth } from '../../../../helpers'

import { it } from '../../../../../test'

import getHealthFactor from './index'


const liqThresholdPercent = 1000000000000000000n

const cases = [
  {
    name: 'healthy',
    input: { mintedAssets: 1000n, stakedAssets: 1020n, liqThresholdPercent },
    expected: { value: 1.02, health: OsTokenPositionHealth.Healthy },
  },
  {
    name: 'moderate',
    input: { mintedAssets: 1000n, stakedAssets: 1015n, liqThresholdPercent },
    expected: { value: 1.015, health: OsTokenPositionHealth.Moderate },
  },
  {
    name: 'risky',
    input: { mintedAssets: 1000n, stakedAssets: 1005n, liqThresholdPercent },
    expected: { value: 1.005, health: OsTokenPositionHealth.Risky },
  },
  {
    name: 'unhealthy',
    input: { mintedAssets: 1000n, stakedAssets: 995n, liqThresholdPercent },
    expected: { value: 0.995, health: OsTokenPositionHealth.Unhealthy },
  },
]

describe('getHealthFactor', () => {

  it.for(cases)('$name', ({ input, expected }) => {
    const result = getHealthFactor(input)

    expect(result).toEqual(expected)
  })

  it('zero assets', () => {
    const noMinted = { mintedAssets: 0n, stakedAssets: 1000n, liqThresholdPercent }
    const noStaked = { mintedAssets: 1000n, stakedAssets: 0n, liqThresholdPercent }
    const expected = { value: 0, health: OsTokenPositionHealth.Healthy }

    const noMintedResult = getHealthFactor(noMinted)
    const noStakedResult = getHealthFactor(noStaked)

    expect(noMintedResult).toEqual(expected)
    expect(noStakedResult).toEqual(expected)
  })
})
