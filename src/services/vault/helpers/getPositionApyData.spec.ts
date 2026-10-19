import { describe, expect } from 'vitest'
import { parseEther } from 'ethers'

import { it } from '../../../../test'

import getPositionApyData from './getPositionApyData'


const osTokenRate = parseEther('1.25')

const vault = {
  apy: '4',
  allocatorMaxBoostApy: '10',
  osTokenConfig: {
    ltvPercent: '800000000000000000',
    leverageMaxMintLtvPercent: '990000000000000000',
  },
}

const aave = {
  borrowApy: '3',
  leverageMaxBorrowLtvPercent: '930000000000000000',
}

const osToken = {
  apy: '4',
  feePercent: 2000,
}

const fullApyData = {
  vaultApy: 4,
  borrowApy: 3,
  osTokenApy: 4,
  feePercent: 2000,
  ltvPercent: parseEther('0.8'),
  osTokenRate,
  osTokenMintApy: 1.25,
  allocatorMaxBoostApy: 10,
  leverageMaxMintLtvPercent: parseEther('0.99'),
  leverageMaxBorrowLtvPercent: parseEther('0.93'),
}

const missingData = {
  vault: { ...vault, osTokenConfig: null },
  aave: null,
  osTokenRate,
}

const missingApyData = {
  ...fullApyData,
  borrowApy: 0,
  osTokenApy: 0,
  feePercent: 0,
  ltvPercent: 0n,
  osTokenMintApy: 0,
  leverageMaxMintLtvPercent: 0n,
  leverageMaxBorrowLtvPercent: 0n,
}

const zeroYieldData = {
  vault: { ...vault, apy: '0' },
  aave: { ...aave, borrowApy: '0' },
  osToken: { ...osToken, apy: '0' },
  osTokenRate,
}

const zeroYieldApyData = {
  ...fullApyData,
  vaultApy: 0,
  borrowApy: 0,
  osTokenApy: 0,
  osTokenMintApy: 0,
}

const cases = [
  { name: 'full data', values: { vault, aave, osToken, osTokenRate }, expected: fullApyData },
  { name: 'missing data', values: missingData, expected: missingApyData },
  { name: 'zero yield', values: zeroYieldData, expected: zeroYieldApyData },
]

describe('getPositionApyData', () => {
  it.for(cases)('$name', ({ values, expected }) => {
    const apyData = getPositionApyData(values)

    expect(apyData).toEqual(expected)
  })
})
