type DaySnapshot = {
  APY: number
  TVL: string
}

export type ModifiedDaySnapshots = {
  days: DaySnapshot[]
  first: DaySnapshot | null
}
