type UserReward = {
  sumRewards: number
  dailyRewards: number
}

export type ModifyUserReward = {
  days: Record<number, UserReward>
}
