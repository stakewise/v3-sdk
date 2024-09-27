import { formatEther } from 'ethers'

import { ModifiedVaultStats } from './types'
import type { VaultStatsQueryPayload } from '../../../../graphql/subgraph/vault'


const modifyVaultStats = (data: VaultStatsQueryPayload): ModifiedVaultStats[] => {
  const vaultStats = data?.vaultStats || []

  return vaultStats.map((stat) => {
    const timeInSeconds = Number(stat.timestamp) / 1000000
    const balance = Number(formatEther(stat.totalAssets || '0'))
    const rewards = Number(formatEther(stat.earnedAssets || '0'))
    const totalApy = (rewards * 365 * 100) / (balance - rewards)

    return {
      balance,
      rewards,
      apy: totalApy,
      time: timeInSeconds,
    }
  })
}


export default modifyVaultStats
