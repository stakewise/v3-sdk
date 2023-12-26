type Snapshot = {
  APY: number
  TVL: number
}

export type ModifiedSnapshots = {
  days: Record<number, Snapshot>
  first: Snapshot | null
}
