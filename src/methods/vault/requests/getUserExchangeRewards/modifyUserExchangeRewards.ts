import { formatEther } from 'ethers'

import type { ModifyUserExchangeRewards, GbpRate } from './types'
import type { UserExchangeRewardsQueryPayload } from '../../../../graphql/subgraph/vault'


type Input = {
  reward: UserExchangeRewardsQueryPayload['allocator'][number]
  assetsUsdRate: number
  usdToEurRate: number
  usdToGbpRate: number
}

export const modifyReward = (input: Input) => {
  const { reward, assetsUsdRate, usdToGbpRate, usdToEurRate } = input

  const timeInSeconds = Number(reward.timestamp) / 1000000
  const earnedAssetsInEther = Number(formatEther(reward.earnedAssets))
  const earnedAssetsInUsd = earnedAssetsInEther * assetsUsdRate

  return {
    date: timeInSeconds,
    dailyRewards: earnedAssetsInEther,
    dailyRewardsUsd: earnedAssetsInUsd || 0,
    dailyRewardsEur: earnedAssetsInUsd * Number(usdToEurRate) || 0,
    dailyRewardsGbp: earnedAssetsInUsd * Number(usdToGbpRate) || 0,
  }
}

const modifyUserExchangeRewards = (mainnetGbpRates: GbpRate[]) => (data: UserExchangeRewardsQueryPayload): ModifyUserExchangeRewards[] => {
  const allocatorStats = data?.allocator || []
  const exchangeRateStats = data?.exchangeRate || []

  const result = allocatorStats.map((stat, index) => {
    const gbpRate = mainnetGbpRates.length ? mainnetGbpRates[index]?.usdToGbpRate : exchangeRateStats[index]?.usdToGbpRate

    return modifyReward({
      reward: stat,
      usdToGbpRate: Number(gbpRate),
      assetsUsdRate: Number(exchangeRateStats[index]?.assetsUsdRate),
      usdToEurRate: Number(exchangeRateStats[index]?.usdToEurRate),
    })
  })

  return result.sort((a, b) => a.date - b.date)
}


export default modifyUserExchangeRewards
