type DaySnapshot = {
  APY: number
  TVL: string
}

export type ModifiedDaySnapshots = {
  days: Record<number, DaySnapshot>
  first: DaySnapshot | null
}
