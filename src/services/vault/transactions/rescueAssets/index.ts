import rescueAssets from './rescueAssets'
import rescueAssetsGas from './rescueAssetsGas'
import rescueAssetsEncode from './rescueAssetsEncode'
import type { RescueAssetsInput, ExtractRescueAssets } from './types'


export const createRescueAssets = (params: StakeWise.CommonParams): ExtractRescueAssets => {
  const result = (values: StakeWise.ExtractInput<RescueAssetsInput>) => rescueAssets({ ...params, ...values })
  result.encode = (values: StakeWise.ExtractInput<RescueAssetsInput>) => rescueAssetsEncode({ ...params, ...values })
  result.estimateGas = (values: StakeWise.ExtractInput<RescueAssetsInput>) => rescueAssetsGas({ ...params, ...values })

  return result
}

export type { ExtractRescueAssets } from './types'
