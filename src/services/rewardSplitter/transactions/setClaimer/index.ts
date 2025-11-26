import setClaimer from './setClaimer'
import setClaimerGas from './setClaimerGas'
import setClaimerEncode from './setClaimerEncode'
import type { SetClaimerInput, ExtractSetClaimer } from './types'


export const createSetClaimer = (params: StakeWise.CommonParams): ExtractSetClaimer  => {
  const result = (values: StakeWise.ExtractInput<SetClaimerInput>) => setClaimer({ ...params, ...values })
  result.encode = (values: StakeWise.ExtractInput<SetClaimerInput>) => setClaimerEncode({ ...params, ...values })
  result.estimateGas = (values: StakeWise.ExtractInput<SetClaimerInput>) => setClaimerGas({ ...params, ...values })

  return result
}

export type { ExtractSetClaimer } from './types'
