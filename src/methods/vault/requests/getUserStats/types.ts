type ChartStat = {
  value: number
  time: number
}

export type UserStatsMap = {
  apy: { [timestamp: string]: ChartStat }
  balance: { [timestamp: string]: ChartStat }
  rewards: { [timestamp: string]: ChartStat }
}

export type ModifiedUserStats = {
  apy: ChartStat[]
  balance: ChartStat[]
  rewards: ChartStat[]
}

