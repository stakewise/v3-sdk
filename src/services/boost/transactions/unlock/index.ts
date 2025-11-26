import unlock from './unlock'
import unlockGas from './unlockGas'
import unlockEncode from './unlockEncode'
import type { UnlockInput, ExtractUnlock } from './types'


export const createUnlock = (params: StakeWise.CommonParams): ExtractUnlock  => {
  const result = (values: StakeWise.ExtractInput<UnlockInput>) => unlock({ ...params, ...values })
  result.encode = (values: StakeWise.ExtractInput<UnlockInput>) => unlockEncode({ ...params, ...values })
  result.estimateGas = (values: StakeWise.ExtractInput<UnlockInput>) => unlockGas({ ...params, ...values })

  return result
}

export type { ExtractUnlock } from './types'
