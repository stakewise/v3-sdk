import lock from './lock'
import lockGas from './lockGas'
import lockEncode from './lockEncode'
import type { LockInput, ExtractLock } from './types'


export const createLock = (params: StakeWise.CommonParams): ExtractLock  => {
  const result = (values: StakeWise.ExtractInput<LockInput>) => lock({ ...params, ...values })
  result.encode = (values: StakeWise.ExtractInput<LockInput>) => lockEncode({ ...params, ...values })
  result.estimateGas = (values: StakeWise.ExtractInput<LockInput>) => lockGas({ ...params, ...values })

  return result
}

export type { ExtractLock } from './types'
