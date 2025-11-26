export type BurnInput = {
  shares: bigint
  userAddress: string
  vaultAddress: string
  provider: StakeWise.Provider
  contracts: StakeWise.Contracts
}

export interface ExtractBurn {
  (values: StakeWise.ExtractInput<BurnInput>): Promise<StakeWise.TransactionHash>
  estimateGas: (values: StakeWise.ExtractInput<BurnInput>) => Promise<bigint>
  encode: (values: StakeWise.ExtractInput<BurnInput>) => Promise<StakeWise.TransactionData>
}
