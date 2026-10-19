import { describe, expect } from 'vitest'
import { parseEther } from 'ethers'

import { it, positionData, positionVault } from '../../../../test'

import validatePositionInput from './validatePositionInput'


const zeroDeltas = {
  stakedAssetsDelta: 0n,
  mintedSharesDelta: 0n,
  boostedSharesDelta: 0n,
}

const deltas = {
  stakedAssetsDelta: parseEther('1'),
  mintedSharesDelta: parseEther('-2'),
  boostedSharesDelta: parseEther('3'),
}

const noVaultData = { ...positionData, vault: null }

const invalidApyData = { ...positionVault.apyData, ltvPercent: '1' }
const invalidCollateralized = { ...positionVault, isCollateralized: 'yes' }

const validCases = [
  {
    name: 'default deltas',
    values: { data: positionData },
    expected: { data: positionData, ...zeroDeltas },
  },
  {
    name: 'given deltas',
    values: { data: positionData, ...deltas },
    expected: { data: positionData, ...deltas },
  },
  {
    name: 'no vault',
    values: { data: noVaultData },
    expected: { data: noVaultData, ...zeroDeltas },
  },
]

const invalidCases = [
  {
    name: 'invalid stakedAssets',
    values: { data: { ...positionData, stakedAssets: 1 } },
    expected: 'The "data.stakedAssets" argument must be of type bigint',
  },
  {
    name: 'invalid isCollateralized',
    values: { data: { ...positionData, vault: invalidCollateralized } },
    expected: 'The "data.vault.isCollateralized" argument must be a boolean',
  },
  {
    name: 'invalid ltvPercent',
    values: { data: { ...positionData, vault: { ...positionVault, apyData: invalidApyData } } },
    expected: 'The "data.vault.apyData.ltvPercent" argument must be of type bigint',
  },
  {
    name: 'invalid delta',
    values: { data: positionData, mintedSharesDelta: 1 },
    expected: 'The "mintedSharesDelta" argument must be of type bigint',
  },
]

describe('validatePositionInput', () => {
  it.for(validCases)('$name', ({ values, expected }) => {
    const input = validatePositionInput(values)

    expect(input).toEqual(expected)
  })

  it.for(invalidCases)('$name', ({ values, expected }) => {
    const validate = () => validatePositionInput(values)

    expect(validate).toThrow(expected)
  })
})
