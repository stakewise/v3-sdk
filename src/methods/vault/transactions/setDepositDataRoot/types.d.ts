export type SetDepositDataRootInput = {
  userAddress: string
  vaultAddress: string
  validatorsRoot: string
  options: StakeWise.Options
  provider: StakeWise.Provider
  contracts: StakeWise.Contracts
}

export interface SetDepositDataRoot {
  (values: SetDepositDataRootInput): Promise<StakeWise.TransactionHash>
  estimateGas: (values: SetDepositDataRootInput) => Promise<bigint>
  encode: (values: SetDepositDataRootInput) => Promise<StakeWise.TransactionData>
}
