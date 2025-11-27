export type BurnInput = StakeWise.CommonParams & {
  shares: bigint
  userAddress: string
  vaultAddress: string
}

export interface ExtractBurn {
  (values: StakeWise.ExtractInput<BurnInput>): Promise<StakeWise.TransactionHash>
  estimateGas: (values: StakeWise.ExtractInput<BurnInput>) => Promise<bigint>
  encode: (values: StakeWise.ExtractInput<BurnInput>) => Promise<StakeWise.TransactionData>
}
