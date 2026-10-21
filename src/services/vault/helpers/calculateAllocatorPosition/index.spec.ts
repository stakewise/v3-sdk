import { describe, expect } from 'vitest'
import { parseEther } from 'ethers'

import {
  it,
  positionData,
  zeroYieldData,
  emptyPosition,
  positionVault,
  osTokenDisabledData,
} from '../../../../../test'
import { allocatorPosition } from '../../../../../test/mocks/positionData'

import calculateAllocatorPosition from './index'


const boostOverMint = { ...positionData, boostedShares: parseEther('7') }

const cases = [
  {
    name: 'boost over mint',
    values: { data: boostOverMint },
    expected: { apy: 3.9, totalAssets: parseEther('12.5') },
  },
  {
    name: 'stake delta',
    values: { data: positionData, stakedAssetsDelta: parseEther('10') },
    expected: { apy: 4.1875, totalAssets: parseEther('20') },
  },
  {
    name: 'mint delta',
    values: { data: positionData, mintedSharesDelta: parseEther('5') },
    expected: { apy: 3.75, totalAssets: parseEther('10') },
  },
  {
    name: 'negative minted shares',
    values: { data: positionData, mintedSharesDelta: parseEther('-6') },
    expected: { apy: 4, totalAssets: parseEther('15') },
  },
  {
    name: 'boost delta',
    values: {
      data: { ...positionData, boostedShares: 0n },
      boostedSharesDelta: parseEther('1.63'),
    },
    expected: { apy: 4.49125, totalAssets: parseEther('10') },
  },
  {
    name: 'negative boost delta',
    values: { data: boostOverMint, boostedSharesDelta: parseEther('-4') },
    expected: { apy: 3.9, totalAssets: parseEther('12.5') },
  },
  {
    name: 'boost equals mint',
    values: { data: { ...positionData, boostedShares: parseEther('5'), leverageReward: parseEther('1.5') } },
    expected: { apy: 10, totalAssets: parseEther('10') },
  },
  {
    name: 'extra boost uncapped',
    values: { data: { ...boostOverMint, leverageReward: parseEther('5') } },
    expected: { apy: 43.1, totalAssets: parseEther('12.5') },
  },
  {
    name: 'osToken disabled',
    values: { data: osTokenDisabledData },
    expected: { apy: 4, totalAssets: parseEther('10') },
  },
  {
    name: 'osToken disabled zero',
    values: { data: osTokenDisabledData, stakedAssetsDelta: -positionData.stakedAssets },
    expected: emptyPosition,
  },
  {
    name: 'osToken disabled empty',
    values: { data: osTokenDisabledData, stakedAssetsDelta: parseEther('-11') },
    expected: emptyPosition,
  },
  {
    name: 'zero total',
    values: { data: positionData, stakedAssetsDelta: -positionData.stakedAssets },
    expected: emptyPosition,
  },
  {
    name: 'empty position',
    values: { data: positionData, stakedAssetsDelta: parseEther('-11') },
    expected: emptyPosition,
  },
  {
    name: 'no vault',
    values: { data: { ...positionData, vault: null } },
    expected: emptyPosition,
  },
  {
    name: 'zero yield',
    values: { data: zeroYieldData },
    expected: { apy: 0, totalAssets: parseEther('10') },
  },
]

describe('calculateAllocatorPosition', () => {
  it.for(cases)('$name', ({ values, expected }) => {
    const position = calculateAllocatorPosition(values)

    expect(position).toEqual(expected)
  })

  it('invalid input', () => {
    const apyData = { ...positionVault.apyData, vaultApy: Number.NaN }
    const data = { ...positionData, vault: { ...positionVault, apyData } }

    const calculate = () => calculateAllocatorPosition({ data })

    expect(calculate).toThrow('The "data.vault.apyData.vaultApy" argument must be a number')
  })

  it('subgraph parity', async ({ getPositionDataFromMock }) => {
    const { subgraph, formula } = allocatorPosition
    const expected = BigInt(formula.totalAssets)

    const data = await getPositionDataFromMock(allocatorPosition)
    const { apy, totalAssets } = calculateAllocatorPosition({ data })

    expect(apy).toBeCloseTo(Number(subgraph.apy), 5)
    expect([ expected, expected - 1n ]).toContain(totalAssets)
  })
})
