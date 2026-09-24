import { formatEther } from 'ethers'


type Snapshot = {
  boostEarnedAssets?: string
  stakeEarnedAssets?: string
  earnedAssets: string
  totalAssets: string
  timestamp: string
  apy?: string
}

type Input = Array<Snapshot>

type ExtraData = {
  boostRewards: number
  stakeRewards: number
}

type Data = {
  extraData?: ExtraData
  value: number
  time: number
}

type StatsMap = {
  apy: Record<string, Data>
  balance: Record<string, Data>
  rewards: Record<string, Data>
}

type ModifiedStats = {
  apy: Data[]
  balance: Data[]
  rewards: Data[]
}

const secondsInDay = 86_400
const microsecondsInSecond = 1_000_000
const millisecondsInDay = secondsInDay * 1_000
const microsecondsInDay = secondsInDay * microsecondsInSecond

const alignToDay = (timestamp: string) => (
  Math.floor(Number(timestamp) / microsecondsInDay) * microsecondsInDay
)

const getLastFullDayTimestamp = () => (
  Math.floor(Date.now() / millisecondsInDay) * microsecondsInDay - microsecondsInDay
)

const createEmptySnapshotTemplate = (snapshot: Snapshot): Omit<Snapshot, 'timestamp'> => {
  const { apy, boostEarnedAssets, stakeEarnedAssets } = snapshot

  return {
    boostEarnedAssets: boostEarnedAssets === undefined ? undefined : '0',
    stakeEarnedAssets: stakeEarnedAssets === undefined ? undefined : '0',
    apy: apy === undefined ? undefined : '0',
    earnedAssets: '0',
    totalAssets: '0',
  }
}

const fillEmptyDays = (data: Input, daysCount?: number): Input => {
  if (!data.length) {
    return data
  }

  const timestamps = data.map(({ timestamp }) => alignToDay(timestamp))

  const lastRealTimestamp = Math.max(...timestamps)
  const firstRealTimestamp = Math.min(...timestamps)

  const lastTimestamp = daysCount
    ? Math.max(lastRealTimestamp, getLastFullDayTimestamp())
    : lastRealTimestamp

  const firstTimestamp = daysCount
    ? Math.max(firstRealTimestamp, lastTimestamp - (daysCount - 1) * microsecondsInDay)
    : firstRealTimestamp

  const existingTimestamps = new Set(timestamps)
  const emptySnapshotTemplate = createEmptySnapshotTemplate(data[0])

  const result = data.filter((_, index) => (
    timestamps[index] >= firstTimestamp && timestamps[index] <= lastTimestamp
  ))

  for (let t = firstTimestamp; t <= lastTimestamp; t += microsecondsInDay) {
    if (!existingTimestamps.has(t)) {
      result.push({
        ...emptySnapshotTemplate,
        timestamp: String(t),
      })
    }
  }

  return result
}

const calculateUserStats = (data: Input, daysCount?: number): ModifiedStats => {
  const result: StatsMap = {
    apy: {},
    balance: {},
    rewards: {},
  }

  fillEmptyDays(data, daysCount).forEach((stats) => {
    const {
      boostEarnedAssets,
      stakeEarnedAssets,
      earnedAssets,
      totalAssets,
      timestamp,
      apy,
    } = stats

    const timeInSeconds = Number(timestamp) / microsecondsInSecond
    const balance = Number(formatEther(totalAssets || 0n))
    const rewards = Number(formatEther(earnedAssets || 0n))

    const keys = (Object.keys(result) as Array<keyof StatsMap>)

    keys.forEach((key) => {
      if (!result[key][timestamp]) {
        result[key][timestamp] = { value: 0, time: timeInSeconds }
      }
    })

    result.balance[timestamp].value += balance
    result.rewards[timestamp].value += rewards

    if (apy) {
      result.apy[timestamp].value += Number(apy)
    }

    const extraData: Partial<ExtraData> = {}

    if (boostEarnedAssets) {
      extraData.boostRewards = Number(formatEther(boostEarnedAssets))
    }

    if (stakeEarnedAssets) {
      extraData.stakeRewards = Number(formatEther(stakeEarnedAssets))
    }

    if (Object.keys(extraData).length) {
      result.rewards[timestamp].extraData = extraData as ExtraData
    }
  })

  return {
    apy: Object.values(result.apy).sort((a, b) => a.time - b.time),
    balance: Object.values(result.balance).sort((a, b) => a.time - b.time),
    rewards: Object.values(result.rewards).sort((a, b) => a.time - b.time),
  }
}


export default calculateUserStats
