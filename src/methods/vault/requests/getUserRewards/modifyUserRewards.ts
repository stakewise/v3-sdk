import { formatEther } from 'ethers'

import { ModifyUserReward } from './types'
import type { UserRewardsQueryPayload } from '../../../../graphql/backend/vault'


export const modifyUserReward = (reward: Omit<UserRewardsQueryPayload['userRewards'][number], 'date'>) => {
  const sumRewards = String(reward.sumRewards) || '0'
  const dailyRewards = String(reward.dailyRewards) || '0'

  return {
    sumRewards: Number(formatEther(sumRewards)),
    dailyRewards: Number(formatEther(dailyRewards)),
  }
}

const modifyUserRewards = (input: UserRewardsQueryPayload): ModifyUserReward => {
  const days = input.userRewards.reduce((acc, { date, ...rest }) => {
    acc[Number(date)] = modifyUserReward(rest)

    return acc
  }, {} as ModifyUserReward['days'])

  return { days }
}


export default modifyUserRewards
