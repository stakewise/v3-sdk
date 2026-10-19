import { describe, expect } from 'vitest'

import { it, getWeiString } from '../../test'

import mergeRewardsFiat from './mergeRewardsFiat'


type Rates = Parameters<typeof mergeRewardsFiat>[0]['fiatRates']

const firstDate = 1790121600000
const secondDate = 1790208000000
const thirdDate = 1790294400000
const firstDay = String(firstDate * 1000)
const secondDay = String(secondDate * 1000)
const thirdDay = String(thirdDate * 1000)

const getRate = (timestamp: string, values: Partial<Rates[number]> = {}) => ({
  timestamp,
  assetsUsdRate: '2000',
  usdToEurRate: '0.5',
  usdToGbpRate: '0.25',
  usdToCnyRate: '7',
  usdToJpyRate: '150',
  usdToKrwRate: '1300',
  usdToAudRate: '1.5',
  ...values,
})

const zeroFiat = {
  dailyRewardsUsd: 0,
  dailyRewardsEur: 0,
  dailyRewardsGbp: 0,
  dailyRewardsCny: 0,
  dailyRewardsJpy: 0,
  dailyRewardsKrw: 0,
  dailyRewardsAud: 0,
}

const getUnratedReward = (date: number, dailyRewards: number) => ({
  ...zeroFiat,
  date,
  dailyRewards,
  dailyStakeRewards: 0,
  dailyBoostRewards: 0,
})

const ratedReward = {
  date: firstDate,
  dailyRewards: 1,
  dailyStakeRewards: 0,
  dailyBoostRewards: 0,
  dailyRewardsUsd: 2000,
  dailyRewardsEur: 1000,
  dailyRewardsGbp: 500,
  dailyRewardsCny: 14000,
  dailyRewardsJpy: 300000,
  dailyRewardsKrw: 2600000,
  dailyRewardsAud: 3000,
}

const thirdRatedReward = {
  date: thirdDate,
  dailyRewards: 2,
  dailyStakeRewards: 0,
  dailyBoostRewards: 0,
  dailyRewardsUsd: 4000,
  dailyRewardsEur: 2000,
  dailyRewardsGbp: 1000,
  dailyRewardsCny: 28000,
  dailyRewardsJpy: 600000,
  dailyRewardsKrw: 5200000,
  dailyRewardsAud: 6000,
}

const cases = [
  {
    name: 'invalid assets rate',
    rewards: [ { timestamp: firstDay, earnedAssets: getWeiString('1') } ],
    fiatRates: [ getRate(firstDay, { assetsUsdRate: 'invalid' }) ],
    expected: [ getUnratedReward(firstDate, 1) ],
  },
  {
    name: 'same day rewards',
    rewards: [
      {
        timestamp: firstDay,
        earnedAssets: getWeiString('1'),
        stakeEarnedAssets: getWeiString('0.25'),
        boostEarnedAssets: getWeiString('0.75'),
      },
      {
        timestamp: firstDay,
        earnedAssets: getWeiString('0.5'),
        stakeEarnedAssets: getWeiString('0.5'),
      },
    ],
    fiatRates: [ getRate(firstDay) ],
    expected: [
      {
        date: firstDate,
        dailyRewards: 1.5,
        dailyStakeRewards: 0.75,
        dailyBoostRewards: 0.75,
        dailyRewardsUsd: 3000,
        dailyRewardsEur: 1500,
        dailyRewardsGbp: 750,
        dailyRewardsCny: 21000,
        dailyRewardsJpy: 450000,
        dailyRewardsKrw: 3900000,
        dailyRewardsAud: 4500,
      },
    ],
  },
  {
    name: 'partial rates',
    rewards: [
      { timestamp: firstDay, earnedAssets: getWeiString('1') },
      { timestamp: secondDay, earnedAssets: getWeiString('2') },
    ],
    fiatRates: [ getRate(firstDay) ],
    expected: [ ratedReward, getUnratedReward(secondDate, 2) ],
  },
  {
    name: 'missing reward day',
    rewards: [
      { timestamp: thirdDay, earnedAssets: getWeiString('2') },
      { timestamp: firstDay, earnedAssets: getWeiString('1') },
    ],
    fiatRates: [
      getRate(thirdDay),
      getRate(secondDay, { assetsUsdRate: '3000' }),
      getRate(firstDay),
    ],
    expected: [ ratedReward, thirdRatedReward ],
  },
  {
    name: 'invalid rates',
    rewards: [ { timestamp: firstDay, earnedAssets: getWeiString('1') } ],
    fiatRates: [ getRate(firstDay, { usdToEurRate: 'invalid', usdToGbpRate: '' }) ],
    expected: [ { ...ratedReward, dailyRewardsEur: 0, dailyRewardsGbp: 0 } ],
  },
  {
    name: 'sorted by date',
    rewards: [
      { timestamp: secondDay, earnedAssets: getWeiString('2') },
      { timestamp: firstDay, earnedAssets: getWeiString('1') },
    ],
    fiatRates: [],
    expected: [ getUnratedReward(firstDate, 1), getUnratedReward(secondDate, 2) ],
  },
]

describe('mergeRewardsFiat', () => {

  it.for(cases)('$name', ({ rewards, fiatRates, expected }) => {
    const result = mergeRewardsFiat({ rewards, fiatRates })

    expect(result).toEqual(expected)
  })
})
