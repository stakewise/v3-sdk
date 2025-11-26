export type SetDepositDataManagerInput = {
  userAddress: string
  vaultAddress: string
  managerAddress: string
  options: StakeWise.Options
  provider: StakeWise.Provider
  contracts: StakeWise.Contracts
}

export interface ExtractSetDepositDataManager {
  (values: StakeWise.ExtractInput<SetDepositDataManagerRootInput>): Promise<StakeWise.TransactionHash>
  estimateGas: (values: StakeWise.ExtractInput<SetDepositDataManagerRootInput>) => Promise<bigint>
  encode: (values: StakeWise.ExtractInput<SetDepositDataManagerRootInput>) => Promise<StakeWise.TransactionData>
}
