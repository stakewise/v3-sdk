export type DepositBatchInput = StakeWise.CommonParams & {
  assets: bigint
  userAddress: string
  vaultAddress: string
  referrerAddress?: string
}

export interface ExtractDepositBatch {
  (values: StakeWise.ExtractInput<DepositBatchInput>): Promise<StakeWise.TransactionHash>
  encode: (values: StakeWise.ExtractInput<DepositBatchInput>) => Promise<StakeWise.BatchData>
}
