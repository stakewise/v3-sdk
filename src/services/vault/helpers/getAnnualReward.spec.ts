import { describe, expect } from 'vitest'
import { parseEther } from 'ethers'

import { it } from '../../../../test'

import getAnnualReward from './getAnnualReward'


const principal = parseEther('1')
const fractionalApy = { principal, apy: 2.133815312040782 }

const cases = [
  { name: 'annual reward', values: { principal, apy: 5 }, expected: parseEther('0.05') },
  { name: 'fractional apy', values: fractionalApy, expected: 21338153120407820n },
  { name: 'rounds down', values: { principal: 999n, apy: 1 }, expected: 9n },
  { name: 'negative apy', values: { principal: 999n, apy: -1 }, expected: -9n },
  { name: 'zero principal', values: { principal: 0n, apy: 5 }, expected: 0n },
  { name: 'negative principal', values: { principal: -1n, apy: 5 }, expected: 0n },
  { name: 'zero apy', values: { principal, apy: 0 }, expected: 0n },
  { name: 'NaN apy', values: { principal, apy: Number.NaN }, expected: 0n },
]

describe('getAnnualReward', () => {
  it.for(cases)('$name', ({ values, expected }) => {
    const reward = getAnnualReward(values.principal, values.apy)

    expect(reward).toBe(expected)
  })
})
