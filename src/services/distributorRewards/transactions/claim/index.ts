import claim from './claim'
import claimGas from './claimGas'
import claimEncode from './claimEncode'
import type { ClaimInput, ExtractClaim } from './types'


export const createClaim = (params: StakeWise.CommonParams): ExtractClaim  => {
  const result = (values: StakeWise.ExtractInput<ClaimInput>) => claim({ ...params, ...values })
  result.encode = (values: StakeWise.ExtractInput<ClaimInput>) => claimEncode({ ...params, ...values })
  result.estimateGas = (values: StakeWise.ExtractInput<ClaimInput>) => claimGas({ ...params, ...values })

  return result
}

export type { ExtractClaim } from './types'
