export type FeeRecipient = {
  shares: bigint
  percent: number
  address: string
}

export type RewardSplitter = {
  owner: string
  address: string
  version: number
  totalShares: bigint
  feeRecipients: FeeRecipient[]
  isClaimOnBehalfEnabled: boolean
}
  