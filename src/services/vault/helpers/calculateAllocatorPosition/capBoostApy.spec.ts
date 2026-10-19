import { describe, expect } from 'vitest'

import { it } from '../../../../../test'

import capBoostApy from './capBoostApy'


const input = {
  apy: 11.5,
  vaultApy: 4,
  allocatorMaxBoostApy: 10,
}

const cases = [
  { name: 'above tolerance', values: input, expected: 10 },
  { name: 'at tolerance', values: { ...input, apy: 11 }, expected: 11 },
  { name: 'extra boost shares', values: { ...input, hasExtraBoostShares: true }, expected: 11.5 },
  { name: 'no max boost apy', values: { ...input, allocatorMaxBoostApy: 0 }, expected: 11.5 },
  { name: 'max below vault apy', values: { ...input, vaultApy: 12 }, expected: 11.5 },
  { name: 'max equals vault apy', values: { ...input, vaultApy: 10 }, expected: 11.5 },
]

describe('capBoostApy', () => {
  it.for(cases)('$name', ({ values, expected }) => {
    const apy = capBoostApy(values)

    expect(apy).toBe(expected)
  })
})
