export type DepositAndMintBatchInput = StakeWise.CommonParams & {
  assets: bigint
  receiveShares: bigint
  userAddress: string
  vaultAddress: string
  referrerAddress?: string
}

export interface ExtractDepositAndMintBatch {
  (values: StakeWise.ExtractInput<DepositAndMintBatchInput>): Promise<StakeWise.TransactionHash>
  encode: (values: StakeWise.ExtractInput<DepositAndMintBatchInput>) => Promise<StakeWise.BatchData>
}
