type FeeRecipient = {
  percent: bigint
  address: string
}

export type RewardSplitter = {
  owner: string
  address: string
  totalPercent: bigint
  feeRecipients: FeeRecipient[]
}
