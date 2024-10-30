import { formatEther } from 'ethers'

import type { ModifiedUserStats, UserStatsMap } from './types'
import type { UserStatsQueryPayload } from '../../../../graphql/subgraph/vault'


const updateUserStatsMap = (
  userStatsMap: UserStatsMap,
  values: {
    earnedAssets: string
    totalAssets: string
    timestamp: string
  },
  includeApy = false
) => {
  const { earnedAssets, totalAssets, timestamp } = values

  const timeInSeconds = Number(timestamp) / 1_000_000
  const balance = Number(formatEther(totalAssets || 0n))
  const rewards = Number(formatEther(earnedAssets || 0n))

  ;(Object.keys(userStatsMap) as Array<keyof UserStatsMap>)
    .forEach((key) => {
      if (!userStatsMap[key][timestamp]) {
        userStatsMap[key][timestamp] = { value: 0, time: timeInSeconds }
      }
    })

  userStatsMap.balance[timestamp].value += balance
  userStatsMap.rewards[timestamp].value += rewards

  if (includeApy) {
    const rewardsSum = userStatsMap.rewards[timestamp].value

    userStatsMap.apy[timestamp].value = (rewardsSum * 365 * 100) / (balance - rewards)
  }
}

const modifyUserStats = (data: UserStatsQueryPayload): ModifiedUserStats => {
  const boostStats = data?.boost || []
  const allocatorStats = data?.allocator || []
  const exitRequestStats = data?.exitRequest || []
  const rewardSplitterStats = data?.rewardSplitter || []

  const userStatsMap: UserStatsMap = {
    apy: {},
    balance: {},
    rewards: {},
  }

  // ATTN The order in which arrays are processed is important!

  boostStats.forEach((stats) => {
    updateUserStatsMap(userStatsMap, stats)
  })

  rewardSplitterStats.forEach((stats) => {
    updateUserStatsMap(userStatsMap, stats)
  })

  allocatorStats.forEach((stats) => {
    updateUserStatsMap(userStatsMap, stats, true)
  })

  // Rewards of this array do not participate in the APY calculation.
  exitRequestStats.forEach((stats) => {
    updateUserStatsMap(userStatsMap, stats)
  })

  const result = {
    apy: Object.values(userStatsMap.apy).sort((a, b) => a.time - b.time),
    balance: Object.values(userStatsMap.balance).sort((a, b) => a.time - b.time),
    rewards: Object.values(userStatsMap.rewards).sort((a, b) => a.time - b.time),
  }

  return result
}


export default modifyUserStats
