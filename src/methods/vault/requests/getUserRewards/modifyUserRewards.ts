import { formatEther } from 'ethers'

import type { ModifyUserRewards, GbpRate } from './types'
import type { UserRewardsQueryPayload } from '../../../../graphql/subgraph/vault'


type Input = {
  reward: UserRewardsQueryPayload['allocator'][number]
  assetsUsdRate: number
  usdToEurRate: number
  usdToGbpRate: number
}

export const modifyReward = (input: Input) => {
  const { reward, assetsUsdRate, usdToGbpRate, usdToEurRate } = input

  const timeInMilliSeconds = Number(reward.timestamp) / 1_000
  const earnedAssetsInEther = Number(formatEther(reward.earnedAssets))
  const earnedAssetsInUsd = earnedAssetsInEther * assetsUsdRate

  return {
    date: timeInMilliSeconds,
    dailyRewards: earnedAssetsInEther,
    dailyRewardsUsd: earnedAssetsInUsd || 0,
    dailyRewardsEur: earnedAssetsInUsd * Number(usdToEurRate) || 0,
    dailyRewardsGbp: earnedAssetsInUsd * Number(usdToGbpRate) || 0,
  }
}

const modifyUserRewards = (mainnetGbpRates: GbpRate[]) => (data: UserRewardsQueryPayload): ModifyUserRewards[] => {
  const allocatorStats = data?.allocator || []
  const exchangeRateStats = data?.exchangeRate || []

  const result = allocatorStats.map((stat, index) => {
    const gbpRate = mainnetGbpRates.length ? mainnetGbpRates[index]?.usdToGbpRate : exchangeRateStats[index]?.usdToGbpRate

    return modifyReward({
      reward: stat,
      usdToGbpRate: Number(gbpRate),
      usdToEurRate: Number(exchangeRateStats[index]?.usdToEurRate),
      assetsUsdRate: Number(exchangeRateStats[index]?.assetsUsdRate),
    })
  })

  return result.sort((a, b) => a.date - b.date)
}


export default modifyUserRewards
