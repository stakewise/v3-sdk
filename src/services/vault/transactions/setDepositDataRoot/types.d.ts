export type SetDepositDataRootInput = {
  userAddress: string
  vaultAddress: string
  depositDataRoot: string
  options: StakeWise.Options
  provider: StakeWise.Provider
  contracts: StakeWise.Contracts
}

export interface ExtractSetDepositDataRoot {
  (values: StakeWise.ExtractInput<SetDepositDataRootInput>): Promise<StakeWise.TransactionHash>
  estimateGas: (values: StakeWise.ExtractInput<SetDepositDataRootInput>) => Promise<bigint>
  encode: (values: StakeWise.ExtractInput<SetDepositDataRootInput>) => Promise<StakeWise.TransactionData>
}
