export type MintInput = {
  shares: bigint
  userAddress: string
  vaultAddress: string
  referrerAddress?: string
  options: StakeWise.Options
  provider: StakeWise.Provider
  contracts: StakeWise.Contracts
}

export interface ExtractMint {
  (values: StakeWise.ExtractInput<MintInput>): Promise<StakeWise.TransactionHash>
  estimateGas: (values: StakeWise.ExtractInput<MintInput>) => Promise<bigint>
  encode: (values: StakeWise.ExtractInput<MintInput>) => Promise<StakeWise.TransactionData>
}
