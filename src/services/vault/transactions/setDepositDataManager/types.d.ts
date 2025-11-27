export type SetDepositDataManagerInput = StakeWise.CommonParams & {
  userAddress: string
  vaultAddress: string
  managerAddress: string
}

export interface ExtractSetDepositDataManager {
  (values: StakeWise.ExtractInput<SetDepositDataManagerRootInput>): Promise<StakeWise.TransactionHash>
  estimateGas: (values: StakeWise.ExtractInput<SetDepositDataManagerRootInput>) => Promise<bigint>
  encode: (values: StakeWise.ExtractInput<SetDepositDataManagerRootInput>) => Promise<StakeWise.TransactionData>
}
