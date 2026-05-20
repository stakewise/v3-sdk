export type RejectSubVaultInput = StakeWise.CommonParams & {
  userAddress: string
  vaultAddress: string
  subVaultAddress: string
}

export interface ExtractRejectSubVaultInput {
  (values: StakeWise.ExtractInput<RejectSubVaultInput>): Promise<StakeWise.TransactionHash>
  estimateGas: (values: StakeWise.ExtractInput<RejectSubVaultInput>) => Promise<bigint>
  encode: (values: StakeWise.ExtractInput<RejectSubVaultInput>) => Promise<StakeWise.TransactionData>
}
