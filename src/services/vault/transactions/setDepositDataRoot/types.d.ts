export type SetDepositDataRootInput = StakeWise.CommonParams & {
  userAddress: string
  vaultAddress: string
  depositDataRoot: string
}

export interface ExtractSetDepositDataRoot {
  (values: StakeWise.ExtractInput<SetDepositDataRootInput>): Promise<StakeWise.TransactionHash>
  estimateGas: (values: StakeWise.ExtractInput<SetDepositDataRootInput>) => Promise<bigint>
  encode: (values: StakeWise.ExtractInput<SetDepositDataRootInput>) => Promise<StakeWise.TransactionData>
}
