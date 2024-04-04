type FeeRecipient = {
  shares: bigint
  percent: number
  address: string
}

export type RewardSplitter = {
  owner: string
  address: string
  totalShares: bigint
  feeRecipients: FeeRecipient[]
}
