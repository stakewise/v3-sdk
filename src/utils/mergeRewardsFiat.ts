import { formatEther } from 'ethers'


type Input = {
  rewards: Reward[]
  fiatRates: FiatRate[]
}

type FiatRate = {
  timestamp: string
  usdToEurRate: string
  usdToGbpRate: string
  assetsUsdRate: string
}

type Reward = {
  timestamp: string
  earnedAssets: string
}

type MergedReward = {
  date: number
  dailyRewards: number
  dailyRewardsUsd: number
  dailyRewardsEur: number
  dailyRewardsGbp: number
}

const mergeRewardsFiat = (values: Input): MergedReward[] => {
  const { fiatRates, rewards } = values

  const mergedStats = rewards.reduce<Record<string, bigint>>((acc, item) => {
    const { timestamp, earnedAssets } = item

    acc[timestamp] = acc[timestamp]
      ? acc[timestamp] + BigInt(earnedAssets)
      : BigInt(earnedAssets)

    return acc
  }, {})

  const result = Object.entries(mergedStats)
    .map((reward, index) => {
      const [ timestamp, earnedAssets ] = reward

      const milliseconds = Number(timestamp) / 1_000
      const assets = Number(formatEther(earnedAssets))

      if (!fiatRates[index]) {
        return {
          date: milliseconds,
          dailyRewardsUsd: 0,
          dailyRewardsEur: 0,
          dailyRewardsGbp: 0,
          dailyRewards: assets,
        }
      }

      const { assetsUsdRate, usdToEurRate, usdToGbpRate } = fiatRates[index]

      const USD = {
        ASSETS:  Number(assetsUsdRate),
        EUR: Number(usdToEurRate),
        GBP: Number(usdToGbpRate),
      }

      const usdResult = assets * USD.ASSETS

      return {
        date: milliseconds,
        dailyRewards: assets,
        dailyRewardsUsd: usdResult || 0,
        dailyRewardsEur: usdResult * USD.EUR || 0,
        dailyRewardsGbp: usdResult * USD.GBP || 0,
      }
    })

  return result.sort((a, b) => a.date - b.date)
}


export default mergeRewardsFiat
