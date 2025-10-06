import { formatEther } from 'ethers'

import { ModifiedVaultStats } from './types'
import type { VaultStatsQueryPayload } from '../../../../graphql/subgraph/vault'


const modifyVaultStats = (data: VaultStatsQueryPayload): ModifiedVaultStats[] => {
  const vaultStats = data?.vaultStats || []

  return vaultStats.map((stat) => {
    const timeInSeconds = Number(stat.timestamp) / 1_000_000
    const balance = Number(formatEther(stat.totalAssets || '0'))
    const rewards = Number(formatEther(stat.earnedAssets || '0'))
    const extraRewards = Number(formatEther(stat.extraEarnedAssets || '0'))
    const stakeRewards = Number(formatEther(stat.stakeEarnedAssets || '0'))

    return {
      balance,
      rewards,
      extraRewards,
      stakeRewards,
      time: timeInSeconds,
      apy: Number(stat.apy),
    }
  })
}


export default modifyVaultStats
