export type MintInput = StakeWise.CommonParams & {
  shares: bigint
  userAddress: string
  vaultAddress: string
  referrerAddress?: string
}

export interface ExtractMint {
  (values: StakeWise.ExtractInput<MintInput>): Promise<StakeWise.TransactionHash>
  estimateGas: (values: StakeWise.ExtractInput<MintInput>) => Promise<bigint>
  encode: (values: StakeWise.ExtractInput<MintInput>) => Promise<StakeWise.TransactionData>
}
