export type WithdrawInput = StakeWise.CommonParams & {
  assets: bigint
  userAddress: string
  vaultAddress: string
}

export interface ExtractWithdraw {
  (values: StakeWise.ExtractInput<WithdrawInput>): Promise<StakeWise.TransactionHash>
  estimateGas: (values: StakeWise.ExtractInput<WithdrawInput>) => Promise<bigint>
  encode: (values: StakeWise.ExtractInput<WithdrawInput>) => Promise<StakeWise.TransactionData>
}
