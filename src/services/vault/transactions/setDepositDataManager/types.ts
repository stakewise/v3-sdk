export type SetDepositDataManagerInput = StakeWise.CommonParams & {
  userAddress: string
  vaultAddress: string
  managerAddress: string
}

export interface ExtractSetDepositDataManager {
  (values: StakeWise.ExtractInput<SetDepositDataManagerInput>): Promise<StakeWise.TransactionHash>
  estimateGas: (values: StakeWise.ExtractInput<SetDepositDataManagerInput>) => Promise<bigint>
  encode: (values: StakeWise.ExtractInput<SetDepositDataManagerInput>) => Promise<StakeWise.TransactionData>
}
