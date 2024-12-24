import { formatEther } from 'ethers'
import { FiatByDayQueryPayload } from '../graphql/subgraph/stats'


type Input = {
  rewards: Reward[]
  fiatRates: FiatByDayQueryPayload['exchangeRate']
}

type Reward = {
  timestamp: string
  earnedAssets: string
}

export type MergedReward = {
  date: number
  dailyRewards: number
  dailyRewardsUsd: number
  dailyRewardsEur: number
  dailyRewardsGbp: number
  dailyRewardsCny: number
  dailyRewardsJpy: number
  dailyRewardsKrw: number
  dailyRewardsAud: number
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
          dailyRewardsCny: 0,
          dailyRewardsJpy: 0,
          dailyRewardsKrw: 0,
          dailyRewardsAud: 0,
          dailyRewards: assets,
        }
      }

      // TODO uncomment when rates will be deployed to mainnet
      const {
        assetsUsdRate,
        usdToEurRate,
        usdToGbpRate,
        // usdToCnyRate,
        // usdToJpyRate,
        // usdToKrwRate,
        // usdToAudRate,
      } = fiatRates[index]

      const USD = {
        ASSETS:  Number(assetsUsdRate),
        EUR: Number(usdToEurRate),
        GBP: Number(usdToGbpRate),
        CNY: Number(7.3),
        JPY: Number(157.21),
        KRW: Number(1453.06),
        AUD: Number(1.6),
      }

      const usdResult = assets * USD.ASSETS

      return {
        date: milliseconds,
        dailyRewards: assets,
        dailyRewardsUsd: usdResult || 0,
        dailyRewardsEur: usdResult * USD.EUR || 0,
        dailyRewardsGbp: usdResult * USD.GBP || 0,
        dailyRewardsCny: usdResult * USD.CNY || 0,
        dailyRewardsJpy: usdResult * USD.JPY || 0,
        dailyRewardsKrw: usdResult * USD.KRW || 0,
        dailyRewardsAud: usdResult * USD.AUD || 0,
      }
    })

  return result.sort((a, b) => a.date - b.date)
}


export default mergeRewardsFiat
