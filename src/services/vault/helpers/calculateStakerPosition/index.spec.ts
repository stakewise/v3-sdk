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
import { stakerPosition } from '../../../../../test/mocks/positionData'

import calculateStakerPosition from './index'


const currentPosition = { apy: 3.7, totalAssets: parseEther('12.5') }

const negativeOwnOsToken = { ...positionData, walletShares: 0n, boostedShares: parseEther('1') }

const nothingToHold = {
  ...positionData,
  stakedAssets: 0n,
  walletShares: 0n,
  boostedShares: 0n,
}

const cases = [
  {
    name: 'current position',
    values: { data: positionData },
    expected: currentPosition,
  },
  {
    name: 'negative own osToken',
    values: { data: negativeOwnOsToken },
    expected: { apy: 5.4, totalAssets: parseEther('6.25') },
  },
  {
    name: 'stake delta',
    values: { data: positionData, stakedAssetsDelta: parseEther('2.5') },
    expected: { apy: 3.75, totalAssets: parseEther('15') },
  },
  {
    name: 'mint delta',
    values: { data: positionData, mintedSharesDelta: parseEther('1') },
    expected: { apy: 3.6, totalAssets: parseEther('12.5') },
  },
  {
    name: 'negative minted shares',
    values: { data: positionData, mintedSharesDelta: parseEther('-7') },
    expected: { apy: 4.75, totalAssets: parseEther('10') },
  },
  {
    name: 'boost delta',
    values: { data: positionData, boostedSharesDelta: parseEther('1.63') },
    expected: { apy: 3.793, totalAssets: parseEther('12.5') },
  },
  {
    name: 'unboost',
    values: { data: positionData, boostedSharesDelta: parseEther('-2') },
    expected: currentPosition,
  },
  {
    name: 'osToken disabled',
    values: { data: osTokenDisabledData },
    expected: { apy: 4.2, totalAssets: parseEther('12.5') },
  },
  {
    name: 'zero total',
    values: { data: positionData, stakedAssetsDelta: parseEther('-12.5') },
    expected: emptyPosition,
  },
  {
    name: 'empty position',
    values: { data: nothingToHold },
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
    expected: { apy: 0, totalAssets: parseEther('12.5') },
  },
]

describe('calculateStakerPosition', () => {
  it.for(cases)('$name', ({ values, expected }) => {
    const position = calculateStakerPosition(values)

    expect(position).toEqual(expected)
  })

  it('invalid input', () => {
    const apyData = { ...positionVault.apyData, osTokenApy: Number.POSITIVE_INFINITY }
    const data = { ...positionData, vault: { ...positionVault, apyData } }

    const calculate = () => calculateStakerPosition({ data })

    expect(calculate).toThrow('The "data.vault.apyData.osTokenApy" argument must be a number')
  })

  it('subgraph parity', async ({ getPositionDataFromMock }) => {
    const { subgraph, formula } = stakerPosition
    const expected = BigInt(formula.totalAssets)

    const data = await getPositionDataFromMock(stakerPosition)
    const { apy, totalAssets } = calculateStakerPosition({ data })

    expect(apy).toBeCloseTo(Number(subgraph.apy), 3)
    expect([ expected, expected - 1n ]).toContain(totalAssets)
  })
})
