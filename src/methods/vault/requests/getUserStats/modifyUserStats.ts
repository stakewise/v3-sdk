import { formatEther } from 'ethers'

import type { ModifiedUserStats, UserStatsMap } from './types'
import type { UserStatsQueryPayload } from '../../../../graphql/subgraph/vault'


const updateUserStatsMap = (
  userStatsMap: UserStatsMap,
  stat: { totalAssets: string, earnedAssets: string, timestamp: string },
  includeApy = false
) => {
  const timeInSeconds = Number(stat.timestamp) / 1_000_000
  const balance = Number(formatEther(stat.totalAssets || 0n))
  const rewards = Number(formatEther(stat.earnedAssets || 0n))

  const totalApy = includeApy
    ? (rewards * 365 * 100) / (balance - rewards)
    : 0

  if (!userStatsMap.balance[stat.timestamp]) {
    userStatsMap.balance[stat.timestamp] = { value: 0, time: timeInSeconds }
  }

  if (!userStatsMap.rewards[stat.timestamp]) {
    userStatsMap.rewards[stat.timestamp] = { value: 0, time: timeInSeconds }
  }

  if (includeApy && !userStatsMap.apy[stat.timestamp]) {
    userStatsMap.apy[stat.timestamp] = { value: 0, time: timeInSeconds }
  }

  userStatsMap.balance[stat.timestamp].value += balance
  userStatsMap.rewards[stat.timestamp].value += rewards

  if (includeApy) {
    userStatsMap.apy[stat.timestamp].value += totalApy
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

  boostStats.forEach((stat) => {
    updateUserStatsMap(userStatsMap, stat, true)
  })

  allocatorStats.forEach((stat) => {
    updateUserStatsMap(userStatsMap, stat, true)
  })

  exitRequestStats.forEach((stat) => {
    updateUserStatsMap(userStatsMap, stat)
  })

  rewardSplitterStats.forEach((stat) => {
    updateUserStatsMap(userStatsMap, stat)
  })

  const result = {
    apy: Object.values(userStatsMap.apy).sort((a, b) => a.time - b.time),
    balance: Object.values(userStatsMap.balance).sort((a, b) => a.time - b.time),
    rewards: Object.values(userStatsMap.rewards).sort((a, b) => a.time - b.time),
  }

  return result
}


export default modifyUserStats
