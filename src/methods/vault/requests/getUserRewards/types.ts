type UserReward = {
  rewards: number
}

export type ModifyUserReward = {
  days: Record<number, UserReward>
}
