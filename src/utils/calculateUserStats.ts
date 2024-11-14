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

/**
 * @description This method collects data from different types of sources one at a time,
 * so the order in the arguments is important. When you send isAccumulateAPY = true,
 * then APY is calculated based on the data already calculated before.
 * @example
 * const data = [
 *  {
 *    data: [ ... ], // DATA 1
 *  },
 *  {
 *    data: [ ... ], // DATA 2
 *  },
 *  {
 *    data: [ ... ], // DATA 3
 *    isAccumulateAPY: true, // Calculate APY from DATA 1, DATA 2, DATA 3 and skip DATA 4
 *  },
 *  {
 *    data: [ ... ], // DATA 4
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

  data.forEach(({ data, isAccumulateAPY }) => {
    data.forEach((stats) => {
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
    })
  })

  return {
    apy: Object.values(result.apy).sort((a, b) => a.time - b.time),
    balance: Object.values(result.balance).sort((a, b) => a.time - b.time),
    rewards: Object.values(result.rewards).sort((a, b) => a.time - b.time),
  }
}


export default calculateUserStats
