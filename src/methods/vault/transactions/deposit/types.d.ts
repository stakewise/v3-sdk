export type DepositInput = {
  assets: bigint
  userAddress: string
  vaultAddress: string
  options: StakeWise.Options
  provider: StakeWise.Provider
  contracts: StakeWise.Contracts
}

export interface Deposit {
  (values: DepositInput): Promise<StakeWise.TransactionHash>
  estimateGas: (values: DepositInput) => Promise<bigint>
  encode: (values: DepositInput) => Promise<StakeWise.TransactionData & { value: bigint }>
}
