import { describe, expect } from 'vitest'
import { parseEther } from 'ethers'

import {
  it,
  stakeAmount,
  userAddress,
  vaultAddress,
  mintedShares,
  ltvCheckBuffer,
  rewardPerSecond,
} from '../../../../test'

import getMaxExitShares from './getMaxExitShares'


const lockedAtZeroYield = 6363636363636363636n

const cases = [
  {
    name: 'partial burn',
    values: { avgRewardPerSecond: rewardPerSecond },
    burnShares: parseEther('2'),
    expected: 5757552848484848483n,
  },
  {
    name: 'full burn',
    values: { avgRewardPerSecond: rewardPerSecond },
    burnShares: mintedShares,
    expected: 9999977090909090907n,
  },
  {
    name: 'burn above position',
    values: { avgRewardPerSecond: rewardPerSecond },
    burnShares: parseEther('7'),
    expected: 9999977090909090907n,
  },
  {
    name: 'without burn',
    values: {},
    burnShares: 0n,
    expected: stakeAmount - lockedAtZeroYield - ltvCheckBuffer,
  },
  {
    name: 'one wei above ceiling',
    values: { stakeShares: lockedAtZeroYield + ltvCheckBuffer + 1n },
    burnShares: 0n,
    expected: 1n,
  },
  {
    name: 'at ceiling',
    values: { stakeShares: lockedAtZeroYield + ltvCheckBuffer },
    burnShares: 0n,
    expected: 0n,
  },
  {
    name: 'locked above stake',
    values: { stakeShares: parseEther('5') },
    burnShares: 0n,
    expected: 0n,
  },
  {
    name: 'no position',
    values: { osTokenShares: 0n },
    burnShares: 0n,
    expected: stakeAmount,
  },
  {
    name: 'no stake',
    values: { stakeShares: 0n },
    burnShares: 0n,
    expected: 0n,
  },
  {
    name: 'zero ltv',
    values: { ltvPercent: 0n },
    burnShares: 0n,
    expected: 0n,
  },
]

describe('getMaxExitShares', () => {
  it.for(cases)('$name', async ({ values, burnShares, expected }, { mockMaxExitShares }) => {
    const params = mockMaxExitShares(values)

    const shares = await getMaxExitShares({ ...params, userAddress, vaultAddress, burnShares })

    expect(shares).toBe(expected)
  })
})
