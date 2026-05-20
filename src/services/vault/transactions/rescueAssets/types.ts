export type RescueAssetsInput = StakeWise.CommonParams & {
  userAddress: string
  vaultAddress: string
}

export interface ExtractRescueAssets {
  (values: StakeWise.ExtractInput<RescueAssetsInput>): Promise<StakeWise.TransactionHash>
  estimateGas: (values: StakeWise.ExtractInput<RescueAssetsInput>) => Promise<bigint>
  encode: (values: StakeWise.ExtractInput<RescueAssetsInput>) => Promise<StakeWise.TransactionData>
}
