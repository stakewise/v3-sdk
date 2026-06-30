export type DepositAndBoostInput = StakeWise.CommonParams & {
  assets: bigint
  boostShares?: bigint
  receiveShares?: bigint
  userAddress: string
  vaultAddress: string
  referrerAddress?: string
  leverageStrategyData?: {
    version: number
    isUpgradeRequired: boolean
  }
}

export interface ExtractDepositAndBoostBatch {
  (values: StakeWise.ExtractInput<DepositAndBoostInput>): Promise<StakeWise.TransactionHash>
  encode: (values: StakeWise.ExtractInput<DepositAndBoostInput>) => Promise<StakeWise.BatchData>
}
