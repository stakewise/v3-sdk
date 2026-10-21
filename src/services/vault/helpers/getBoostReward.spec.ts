import { describe, expect } from 'vitest'
import { parseEther } from 'ethers'

import { it, apyData } from '../../../../test'

import getBoostReward from './getBoostReward'


const input = {
  ...apyData,
  isCollateralized: true,
  isOsTokenEnabled: true,
  boostedSharesDelta: parseEther('1.63'),
}

const newPositionReward = parseEther('0.011625')

const mintLtvCap = {
  ...input,
  ltvPercent: parseEther('0.95'),
  leverageMaxMintLtvPercent: parseEther('0.9'),
}

const negativeDelta = { ...input, boostedSharesDelta: parseEther('-1') }

const fullTotalLtv = {
  ...input,
  ltvPercent: parseEther('1'),
  leverageMaxMintLtvPercent: parseEther('1'),
  leverageMaxBorrowLtvPercent: parseEther('1'),
}

const cases = [
  { name: 'new position', values: input, expected: newPositionReward },
  { name: 'mint ltv cap', values: mintLtvCap, expected: newPositionReward },
  { name: 'not collateralized', values: { ...input, isCollateralized: false }, expected: 0n },
  { name: 'osToken disabled', values: { ...input, isOsTokenEnabled: false }, expected: 0n },
  { name: 'zero ltv', values: { ...input, ltvPercent: 0n }, expected: 0n },
  { name: 'zero delta', values: { ...input, boostedSharesDelta: 0n }, expected: 0n },
  { name: 'negative delta', values: negativeDelta, expected: 0n },
  { name: 'full total ltv', values: fullTotalLtv, expected: 0n },
]

describe('getBoostReward', () => {
  it.for(cases)('$name', ({ values, expected }) => {
    const reward = getBoostReward(values)

    expect(reward).toBe(expected)
  })
})
