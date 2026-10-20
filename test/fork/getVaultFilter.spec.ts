import { describe, expect } from 'vitest'

import { it, vaultAddress, mixedCaseVaultAddress, lowercaseMixedCaseVaultAddress } from '..'
import getVaultFilter from './getVaultFilter'


const cases = [
  {
    name: 'argument',
    input: { vault: mixedCaseVaultAddress, savedVault: vaultAddress },
    expected: { id: lowercaseMixedCaseVaultAddress },
  },
  {
    name: 'saved vault',
    input: { savedVault: mixedCaseVaultAddress },
    expected: { id: lowercaseMixedCaseVaultAddress },
  },
  {
    name: 'none',
    input: {},
    expected: {
      canHarvest: true,
      isPrivate: false,
      isMetaVault: false,
      isBlocklist: false,
    },
  },
]

describe('getVaultFilter', () => {
  it.for(cases)('$name', ({ input, expected }) => {
    const filter = getVaultFilter(input)

    expect(filter).toEqual(expected)
  })
})
