import { describe, expect } from 'vitest'
import { parseEther } from 'ethers'

import { it } from '../../../../test'

import getVaultOsTokenMintApy from './getVaultOsTokenMintApy'


const input = {
  osTokenApy: 4,
  feePercent: 2000,
  ltvPercent: parseEther('0.8'),
}

const cases = [
  { name: 'mint apy', values: input, expected: 1.25 },
  { name: 'zero ltv', values: { ...input, ltvPercent: 0n }, expected: 0 },
  { name: 'full fee', values: { ...input, feePercent: 10_000 }, expected: 0 },
  { name: 'fee above full', values: { ...input, feePercent: 12_000 }, expected: 0 },
  { name: 'zero yield', values: { ...input, osTokenApy: 0 }, expected: 0 },
]

describe('getVaultOsTokenMintApy', () => {
  it.for(cases)('$name', ({ values, expected }) => {
    const { osTokenApy, feePercent, ltvPercent } = values

    const apy = getVaultOsTokenMintApy(osTokenApy, feePercent, ltvPercent)

    expect(apy).toBe(expected)
  })
})
