import { formatEther } from 'ethers'

import { ModifyUserReward } from './types'
import type { UserRewardsQueryPayload } from '../../../../graphql/backend/vault'


export const modifyUserReward = (reward: UserRewardsQueryPayload['userRewards'][number]) => {
  const sumRewards = String(reward.sumRewards) || '0'
  const dailyRewards = String(reward.dailyRewards) || '0'

  return {
    date: Number(reward.date),
    sumRewards: Number(formatEther(sumRewards)),
    dailyRewards: Number(formatEther(dailyRewards)),
    dailyRewardsEur: Number(reward.dailyRewardsEur) || 0,
    dailyRewardsGbp: Number(reward.dailyRewardsGbp) || 0,
    dailyRewardsUsd: Number(reward.dailyRewardsUsd) || 0,
  }
}

const modifyUserRewards = (input: UserRewardsQueryPayload): ModifyUserReward => {
  const days = input.userRewards.reduce((acc, { date, ...rest }) => {
    acc[Number(date)] = modifyUserReward({ date, ...rest })

    return acc
  }, {} as ModifyUserReward['days'])

  return { days }
}


export default modifyUserRewards
