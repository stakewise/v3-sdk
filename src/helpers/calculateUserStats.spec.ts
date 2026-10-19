import { describe, expect } from 'vitest'

import { it, getWeiString } from '../../test'

import calculateUserStats from './calculateUserStats'


const microsecondsInDay = 86_400 * 1_000_000

const now = Date.UTC(2026, 8, 24, 12)
const lastFullDay = Date.UTC(2026, 8, 23) * 1_000

const day = (index: number) => String(lastFullDay - index * microsecondsInDay)

type Values = Partial<{
  boostEarnedAssets: string
  stakeEarnedAssets: string
  earnedAssets: string
  totalAssets: string
  apy: string
}>

const snapshot = (index: number, values?: Values) => ({
  apy: '0',
  boostEarnedAssets: '0',
  stakeEarnedAssets: '0',
  earnedAssets: '0',
  totalAssets: '0',
  timestamp: day(index),
  ...values,
})

const point = (value: number, index: number) => ({ value, time: Number(day(index)) / 1_000_000 })

const zeroExtraData = { boostRewards: 0, stakeRewards: 0 }

const cases = [
  {
    name: 'empty amounts',
    data: [ snapshot(0, { totalAssets: '', earnedAssets: '' }) ],
    expected: {
      apy: [ point(0, 0) ],
      balance: [ point(0, 0) ],
      rewards: [ { ...point(0, 0), extraData: zeroExtraData } ],
    },
  },
  {
    name: 'same day snapshots',
    data: [
      snapshot(0, { totalAssets: getWeiString(1), earnedAssets: getWeiString(1) }),
      snapshot(0, { totalAssets: getWeiString(1), earnedAssets: getWeiString(1) }),
    ],
    expected: {
      apy: [ point(0, 0) ],
      balance: [ point(2, 0) ],
      rewards: [ { ...point(2, 0), extraData: zeroExtraData } ],
    },
  },
  {
    name: 'without optional fields',
    data: [
      { earnedAssets: getWeiString(1), totalAssets: getWeiString(2), timestamp: day(2) },
      { earnedAssets: getWeiString(1), totalAssets: getWeiString(2), timestamp: day(0) },
    ],
    expected: {
      apy: [ point(0, 2), point(0, 1), point(0, 0) ],
      balance: [ point(2, 2), point(0, 1), point(2, 0) ],
      rewards: [ point(1, 2), point(0, 1), point(1, 0) ],
    },
  },
  {
    name: 'apy and extra rewards',
    data: [
      snapshot(1, {
        apy: '3.5',
        boostEarnedAssets: getWeiString(0.5),
        stakeEarnedAssets: getWeiString(0.25),
      }),
      snapshot(0, { apy: '4' }),
    ],
    expected: {
      apy: [ point(3.5, 1), point(4, 0) ],
      balance: [ point(0, 1), point(0, 0) ],
      rewards: [
        { ...point(0, 1), extraData: { boostRewards: 0.5, stakeRewards: 0.25 } },
        { ...point(0, 0), extraData: zeroExtraData },
      ],
    },
  },
  {
    name: 'no snapshots',
    data: [],
    expected: { apy: [], balance: [], rewards: [] },
  },
]

describe('calculateUserStats', () => {

  it.beforeEach(({ clock }) => {
    clock.setSystemTime(now)
  })

  it('after full withdrawal', () => {
    const data = [
      snapshot(4, { totalAssets: getWeiString(2), earnedAssets: getWeiString(1) }),
      snapshot(3, { totalAssets: getWeiString(2) }),
    ]

    const result = calculateUserStats(data, 30)
    const balance = result.balance.map(({ value }) => value)
    const rewards = result.rewards.map(({ value }) => value)
    const lastTime = result.balance.at(-1)?.time

    expect(balance).toEqual([ 2, 2, 0, 0, 0 ])
    expect(rewards).toEqual([ 1, 0, 0, 0, 0 ])
    expect(lastTime).toBe(Number(day(0)) / 1_000_000)
  })

  it('cut to daysCount', () => {
    const data = [ snapshot(40, { totalAssets: getWeiString(1) }) ]

    const { balance } = calculateUserStats(data, 30)

    const isAllZero = balance.every(({ value }) => value === 0)
    const firstTime = balance[0].time

    expect(balance).toHaveLength(30)
    expect(isAllZero).toBe(true)
    expect(firstTime).toBe(Number(day(29)) / 1_000_000)
  })

  it('without daysCount', () => {
    const data = [ snapshot(4, { totalAssets: getWeiString(1) }), snapshot(2) ]

    const result = calculateUserStats(data, undefined)
    const balance = result.balance.map(({ value }) => value)

    expect(balance).toEqual([ 1, 0, 0 ])
  })

  it.for(cases)('$name', ({ data, expected }) => {
    const result = calculateUserStats(data, 30)

    expect(result).toEqual(expected)
  })
})
