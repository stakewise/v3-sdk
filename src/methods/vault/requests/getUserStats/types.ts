type ChartStat = {
  value: number
  time: number
}

export type UserStatsMap = {
  apy: Record<string, ChartStat>
  balance: Record<string, ChartStat>
  rewards: Record<string, ChartStat>
}

export type ModifiedUserStats = {
  apy: ChartStat[]
  balance: ChartStat[]
  rewards: ChartStat[]
}

