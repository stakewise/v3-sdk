import { formatEther } from 'ethers'

import { ModifiedStats } from './types'
import type { OsTokenStatsQueryPayload } from '../../../../graphql/subgraph/osToken'


const modifyStats = (data: OsTokenStatsQueryPayload): ModifiedStats[] => {
  const osTokenStats = data?.osTokenStats || []

  return osTokenStats.map((stat) => {
    const timeInSeconds = Number(stat.timestamp) / 1_000_000
    const balance = Number(formatEther(stat.totalAssets || '0'))
    const rewards = Number(formatEther(stat.earnedAssets || '0'))

    return {
      balance,
      rewards,
      time: timeInSeconds,
      apy: Number(stat.apy),
    }
  })
}


export default modifyStats
