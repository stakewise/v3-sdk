export type AddSubVaultInput = StakeWise.CommonParams & {
  userAddress: string
  vaultAddress: string
  subVaultAddress: string
}

export interface ExtractAddSubVaultInput {
  (values: StakeWise.ExtractInput<AddSubVaultInput>): Promise<StakeWise.TransactionHash>
  estimateGas: (values: StakeWise.ExtractInput<AddSubVaultInput>) => Promise<bigint>
  encode: (values: StakeWise.ExtractInput<AddSubVaultInput>) => Promise<StakeWise.TransactionData>
}
