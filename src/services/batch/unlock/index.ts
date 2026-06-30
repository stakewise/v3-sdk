import unlock from './unlock'
import unlockEncode from './unlockEncode'
import type { UnlockBatchInput, ExtractUnlockBatch } from './types'


export const createUnlock = (params: StakeWise.CommonParams): ExtractUnlockBatch => {
  const result = (values: StakeWise.ExtractInput<UnlockBatchInput>) => unlock({ ...params, ...values })
  result.encode = (values: StakeWise.ExtractInput<UnlockBatchInput>) => unlockEncode({ ...params, ...values })

  return result
}

export type { ExtractUnlockBatch } from './types'
