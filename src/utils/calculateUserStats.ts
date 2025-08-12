import { formatEther } from 'ethers'


type Input = Array<{
  stakeEarnedAssets?: string
  extraEarnedAssets?: string
  earnedAssets: string
  totalAssets: string
  timestamp: string
  apy?: string
}>

type Data = {
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

const format = (value: string) => Number(formatEther(value || 0n))

const calculateUserStats = (data: Input, isSpecial?: boolean): ModifiedStats => {
  const result: StatsMap = {
    apy: {},
    balance: {},
    rewards: {},
  }

  data.forEach((stats) => {
    const { earnedAssets, totalAssets, timestamp, apy, stakeEarnedAssets = '0', extraEarnedAssets = '0' } = stats

    const timeInSeconds = Number(timestamp) / 1_000_000
    const balance = format(totalAssets)
    const rewards = format(earnedAssets)
    const keys = (Object.keys(result) as Array<keyof StatsMap>)

    keys.forEach((key) => {
      if (!result[key][timestamp]) {
        result[key][timestamp] = { value: 0, time: timeInSeconds }
      }
    })

    result.balance[timestamp].value += balance

    result.rewards[timestamp].value += isSpecial
      ? format(stakeEarnedAssets) + format(extraEarnedAssets)
      : rewards

    if (apy) {
      result.apy[timestamp].value += isSpecial
        ? (format(stakeEarnedAssets) + format(extraEarnedAssets)) / (format(totalAssets) - format(stakeEarnedAssets)) * 365 * 100
        : Number(apy)
    }
  })

  return {
    apy: Object.values(result.apy).sort((a, b) => a.time - b.time),
    balance: Object.values(result.balance).sort((a, b) => a.time - b.time),
    rewards: Object.values(result.rewards).sort((a, b) => a.time - b.time),
  }
}


export default calculateUserStats
