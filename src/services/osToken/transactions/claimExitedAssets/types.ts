import type { ClaimExitedAssetsArgs } from './validate'


export type ClaimExitedAssetsInput = StakeWise.CommonParams & ClaimExitedAssetsArgs

export interface ExtractClaimExitedAssets {
  (values: StakeWise.ExtractInput<ClaimExitedAssetsInput>): Promise<StakeWise.TransactionHash>
  estimateGas: (values: StakeWise.ExtractInput<ClaimExitedAssetsInput>) => Promise<bigint>
  encode: (values: StakeWise.ExtractInput<ClaimExitedAssetsInput>) => Promise<StakeWise.TransactionData>
}
