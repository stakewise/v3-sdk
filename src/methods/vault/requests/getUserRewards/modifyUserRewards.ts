import { formatEther } from 'ethers'

import { ModifyUserReward } from './types'
import { UserRewardsQueryPayload } from '../../../../graphql/backend/vault'


export const modifyUserReward = (reward: Omit<UserRewardsQueryPayload['userRewards'][number], 'date'>) => {
  const totalRewards = String(reward.sumRewards) || '0'

  return {
    rewards: Number(formatEther(totalRewards)),
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
