import calculateUserStats from './calculateUserStats'


const microsecondsInDay = 86_400 * 1_000_000

// 2026-09-24 12:00:00 UTC — the last full day the subgraph could have snapshotted is 2026-09-23
const now = 1790251200 * 1_000
const lastFullDay = 1790121600 * 1_000_000

// day(0) is the last full day, day(1) the one before it and so on
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

describe('calculateUserStats', () => {

  beforeAll(() => {
    jest.useFakeTimers().setSystemTime(now)
  })

  afterAll(() => {
    jest.useRealTimers()
  })

  it('should keep the data untouched when there are no gaps', () => {
    const data = [ snapshot(2, { totalAssets: '1000000000000000000' }), snapshot(1), snapshot(0) ]

    const result = calculateUserStats(data, 30)

    expect(result.balance).toHaveLength(3)
    expect(result.balance.map(({ value }) => value)).toEqual([ 1, 0, 0 ])
  })

  it('should restore the days the subgraph skipped after a full withdrawal', () => {
    const data = [
      snapshot(4, { totalAssets: '2000000000000000000', earnedAssets: '1000000000000000000' }),
      snapshot(3, { totalAssets: '2000000000000000000' }),
    ]

    const result = calculateUserStats(data, 30)

    expect(result.balance).toHaveLength(5)
    expect(result.balance.map(({ value }) => value)).toEqual([ 2, 2, 0, 0, 0 ])
    expect(result.rewards.map(({ value }) => value)).toEqual([ 1, 0, 0, 0, 0 ])
    expect(result.balance.at(-1)?.time).toBe(Number(day(0)) / 1_000_000)
  })

  it('should restore the days between two positions', () => {
    const data = [ snapshot(4, { totalAssets: '1000000000000000000' }), snapshot(0, { totalAssets: '3000000000000000000' }) ]

    const result = calculateUserStats(data, 30)

    expect(result.balance.map(({ value }) => value)).toEqual([ 1, 0, 0, 0, 3 ])
  })

  it('should not restore days before the first snapshot', () => {
    const data = [ snapshot(1, { totalAssets: '1000000000000000000' }), snapshot(0, { totalAssets: '1000000000000000000' }) ]

    const result = calculateUserStats(data, 30)

    expect(result.balance).toHaveLength(2)
  })

  it('should cut the restored series down to daysCount', () => {
    const data = [ snapshot(40, { totalAssets: '1000000000000000000' }) ]

    const result = calculateUserStats(data, 30)

    expect(result.balance).toHaveLength(30)
    expect(result.balance.every(({ value }) => value === 0)).toBe(true)
    expect(result.balance[0].time).toBe(Number(day(29)) / 1_000_000)
  })

  it('should not restore anything without daysCount', () => {
    const data = [ snapshot(4, { totalAssets: '1000000000000000000' }), snapshot(2) ]

    const result = calculateUserStats(data, undefined)

    expect(result.balance.map(({ value }) => value)).toEqual([ 1, 0, 0 ])
  })

  it('should return an empty result for an allocator without snapshots', () => {
    const result = calculateUserStats([], 30)

    expect(result).toEqual({ apy: [], balance: [], rewards: [] })
  })
})
