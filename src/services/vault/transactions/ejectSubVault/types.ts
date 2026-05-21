export type EjectSubVaultInput = StakeWise.CommonParams & {
  userAddress: string
  vaultAddress: string
  subVaultAddress: string
}

export interface ExtractEjectSubVaultInput {
  (values: StakeWise.ExtractInput<EjectSubVaultInput>): Promise<StakeWise.TransactionHash>
  estimateGas: (values: StakeWise.ExtractInput<EjectSubVaultInput>) => Promise<bigint>
  encode: (values: StakeWise.ExtractInput<EjectSubVaultInput>) => Promise<StakeWise.TransactionData>
}
