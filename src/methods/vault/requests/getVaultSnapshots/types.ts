type VaultSnapshot = {
  APY: number
  TVL: number
}

export type ModifiedVaultSnapshots = {
  days: Record<number, VaultSnapshot>
  first: VaultSnapshot | null
}
