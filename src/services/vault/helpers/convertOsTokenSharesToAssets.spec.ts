import { describe, expect } from 'vitest'
import { parseEther } from 'ethers'

import { it } from '../../../../test'

import convertOsTokenSharesToAssets from './convertOsTokenSharesToAssets'


const rate = parseEther('1.5')
const contractRate = { shares: parseEther('2'), rate: parseEther('1.05') }

const cases = [
  { name: 'contract rate', values: contractRate, expected: parseEther('2.1') },
  { name: 'rounds down', values: { shares: 3n, rate }, expected: 4n },
  { name: 'negative shares', values: { shares: -3n, rate }, expected: -4n },
  { name: 'zero shares', values: { shares: 0n, rate }, expected: 0n },
]

describe('convertOsTokenSharesToAssets', () => {
  it.for(cases)('$name', ({ values, expected }) => {
    const assets = convertOsTokenSharesToAssets(values.shares, values.rate)

    expect(assets).toBe(expected)
  })
})
