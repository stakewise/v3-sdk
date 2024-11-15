import { formatEther } from 'ethers'


type Stats = {
  data: Array<{
    earnedAssets: string
    totalAssets: string
    timestamp: string
  }>
  isAccumulateAPY?: boolean
}

type Input = {
  data: Stats[]
}

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

const modifyResult = (result: StatsMap, stats: Stats['data'][number], isAccumulateAPY?: boolean) => {
  const { earnedAssets, totalAssets, timestamp } = stats

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

  if (isAccumulateAPY) {
    const rewardsSum = result.rewards[timestamp].value

    result.apy[timestamp].value = (rewardsSum * 365 * 100) / (balance - rewards)
  }
}

/**
 * @description This method collects TVL and Rewards from all elements of the array,
 * and also collects APY for those elements with isAccumulateAPY = true
 * @example
 * const data = [
 *  {
 *    data: [ ... ],
 *  },
 *  {
 *    data: [ ... ],
 *    isAccumulateAPY: true,
 *  },
 *  {
 *    data: [ ... ],
 *    isAccumulateAPY: true,
 *  },
 *  {
 *    data: [ ... ],
 *  },
 * ]
 *
 * calculateUserStats({ data })
 */
const calculateUserStats = (values: Input): ModifiedStats => {
  const { data } = values

  const result: StatsMap = {
    apy: {},
    balance: {},
    rewards: {},
  }

  const dataWithApy = data.filter(({ isAccumulateAPY }) => isAccumulateAPY)
  const dataWithoutApy = data.filter(({ isAccumulateAPY }) => !isAccumulateAPY)

  dataWithApy.forEach(({ data }) => {
    data.forEach((stats) => modifyResult(result, stats, true))
  })

  dataWithoutApy.forEach(({ data }) => {
    data.forEach((stats) => modifyResult(result, stats))
  })

  return {
    apy: Object.values(result.apy).sort((a, b) => a.time - b.time),
    balance: Object.values(result.balance).sort((a, b) => a.time - b.time),
    rewards: Object.values(result.rewards).sort((a, b) => a.time - b.time),
  }
}


export default calculateUserStats
