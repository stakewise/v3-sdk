import claimExitedAssets from './claimExitedAssets'
import claimExitedAssetsGas from './claimExitedAssetsGas'
import claimExitedAssetsEncode from './claimExitedAssetsEncode'
import type { ClaimExitedAssetsInput, ExtractClaimExitedAssets } from './types'


export const createClaimExitedAssets = (params: StakeWise.CommonParams): ExtractClaimExitedAssets => {
  const result = (values: StakeWise.ExtractInput<ClaimExitedAssetsInput>) => claimExitedAssets({ ...params, ...values })
  result.encode = (values: StakeWise.ExtractInput<ClaimExitedAssetsInput>) => claimExitedAssetsEncode({ ...params, ...values })
  result.estimateGas = (values: StakeWise.ExtractInput<ClaimExitedAssetsInput>) => claimExitedAssetsGas({ ...params, ...values })

  return result
}

export type { ExtractClaimExitedAssets } from './types'
