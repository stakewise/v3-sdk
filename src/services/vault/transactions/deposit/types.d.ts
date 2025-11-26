export type DepositInput = {
  assets: bigint
  userAddress: string
  vaultAddress: string
  referrerAddress?: string
  options: StakeWise.Options
  provider: StakeWise.Provider
  contracts: StakeWise.Contracts
}

export interface ExtractDeposit {
  (values: StakeWise.ExtractInput<DepositInput>): Promise<StakeWise.TransactionHash>
  estimateGas: (values: StakeWise.ExtractInput<DepositInput>) => Promise<bigint>
  encode: (values: StakeWise.ExtractInput<DepositInput>) => Promise<StakeWise.TransactionData>
}
