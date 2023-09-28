type DaySnapshot = {
  APY: number
  TVL: number
}

export type ModifiedDaySnapshots = {
  days: Record<number, DaySnapshot>
  first: DaySnapshot | null
}
