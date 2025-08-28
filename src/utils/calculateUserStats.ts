import { formatEther } from 'ethers'


type Input = Array<{
  boostEarnedAssets?: string
  stakeEarnedAssets?: string
  extraEarnedAssets?: string
  osTokenFeeAssets?: string
  earnedAssets: string
  totalAssets: string
  timestamp: string
  apy?: string
}>

type ExtraData = {
  boostRewards: number
  stakeRewards: number
  extraRewards: number
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

const calculateUserStats = (data: Input): ModifiedStats => {
  const result: StatsMap = {
    apy: {},
    balance: {},
    rewards: {},
  }

  data.forEach((stats) => {
    const {
      boostEarnedAssets,
      stakeEarnedAssets,
      extraEarnedAssets,
      osTokenFeeAssets,
      earnedAssets,
      totalAssets,
      timestamp,
      apy,
    } = stats

    const timeInSeconds = Number(timestamp) / 1_000_000
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

    if (extraEarnedAssets) {
      extraData.extraRewards = Number(formatEther(extraEarnedAssets))
    }

    if (stakeEarnedAssets && osTokenFeeAssets) {
      extraData.stakeRewards = Number(formatEther(Number(stakeEarnedAssets) - Number(osTokenFeeAssets)))
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
