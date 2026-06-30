import lock from './lock'
import lockEncode from './lockEncode'
import type { LockBatchInput, ExtractLockBatch } from './types'


export const createLock = (params: StakeWise.CommonParams): ExtractLockBatch => {
  const result = (values: StakeWise.ExtractInput<LockBatchInput>) => lock({ ...params, ...values })
  result.encode = (values: StakeWise.ExtractInput<LockBatchInput>) => lockEncode({ ...params, ...values })

  return result
}

export type { ExtractLockBatch } from './types'
