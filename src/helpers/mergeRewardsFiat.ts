import { formatEther } from 'ethers'
import { FiatByDayQueryPayload } from '../graphql/subgraph/stats'


type Input = {
  rewards: Reward[]
  fiatRates: FiatByDayQueryPayload['exchangeRate']
}

type Reward = {
  timestamp: string
  earnedAssets: string
  stakeEarnedAssets?: string
  boostEarnedAssets?: string
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
  dailyStakeRewards: number
  dailyBoostRewards: number
}

type AggregatedReward = {
  earned: bigint
  stake: bigint
  boost: bigint
}

const mergeRewardsFiat = (values: Input): MergedReward[] => {
  const { fiatRates, rewards } = values

  const mergedStats = rewards.reduce<Record<string, AggregatedReward>>((acc, item) => {
    const { timestamp, earnedAssets, stakeEarnedAssets, boostEarnedAssets } = item

    const current = acc[timestamp] || { earned: 0n, stake: 0n, boost: 0n }

    acc[timestamp] = {
      earned: current.earned + BigInt(earnedAssets),
      stake: current.stake + BigInt(stakeEarnedAssets || 0),
      boost: current.boost + BigInt(boostEarnedAssets || 0),
    }

    return acc
  }, {})

  const result = Object.entries(mergedStats)
    .map((reward, index) => {
      const [ timestamp, aggregated ] = reward

      const milliseconds = Number(timestamp) / 1_000
      const assets = Number(formatEther(aggregated.earned))
      const stakeAssets = Number(formatEther(aggregated.stake))
      const boostAssets = Number(formatEther(aggregated.boost))

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
          dailyStakeRewards: stakeAssets,
          dailyBoostRewards: boostAssets,
        }
      }

      const {
        assetsUsdRate,
        usdToEurRate,
        usdToGbpRate,
        usdToCnyRate,
        usdToJpyRate,
        usdToKrwRate,
        usdToAudRate,
      } = fiatRates[index]

      const USD = {
        ASSETS:  Number(assetsUsdRate),
        EUR: Number(usdToEurRate),
        GBP: Number(usdToGbpRate),
        CNY: Number(usdToCnyRate),
        JPY: Number(usdToJpyRate),
        KRW: Number(usdToKrwRate),
        AUD: Number(usdToAudRate),
      }

      const usdResult = assets * USD.ASSETS

      return {
        date: milliseconds,
        dailyRewards: assets,
        dailyStakeRewards: stakeAssets,
        dailyBoostRewards: boostAssets,
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
