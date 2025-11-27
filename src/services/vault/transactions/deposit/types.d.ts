export type DepositInput = StakeWise.CommonParams & {
  assets: bigint
  userAddress: string
  vaultAddress: string
  referrerAddress?: string
}

export interface ExtractDeposit {
  (values: StakeWise.ExtractInput<DepositInput>): Promise<StakeWise.TransactionHash>
  estimateGas: (values: StakeWise.ExtractInput<DepositInput>) => Promise<bigint>
  encode: (values: StakeWise.ExtractInput<DepositInput>) => Promise<StakeWise.TransactionData>
}
