export type SetDepositDataManagerInput = {
  userAddress: string
  vaultAddress: string
  managerAddress: string
  options: StakeWise.Options
  provider: StakeWise.Provider
  contracts: StakeWise.Contracts
}

export type SetDepositDataManagerRoot = {
  (values: SetDepositDataManagerInput): Promise<StakeWise.TransactionHash>
  estimateGas: (values: SetDepositDataManagerInput) => Promise<bigint>
  encode: (values: SetDepositDataManagerInput) => Promise<StakeWise.TransactionData>
}
