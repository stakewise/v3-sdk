export type WithdrawInput = {
  assets: bigint
  userAddress: string
  vaultAddress: string
  options: StakeWise.Options
  provider: StakeWise.Provider
  contracts: StakeWise.Contracts
}

export interface ExtractWithdraw {
  (values: StakeWise.ExtractInput<WithdrawInput>): Promise<StakeWise.TransactionHash>
  estimateGas: (values: StakeWise.ExtractInput<WithdrawInput>) => Promise<bigint>
  encode: (values: StakeWise.ExtractInput<WithdrawInput>) => Promise<StakeWise.TransactionData>
}
