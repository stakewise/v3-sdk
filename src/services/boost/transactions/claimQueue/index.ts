import claimQueue from './claimQueue'
import claimQueueGas from './claimQueueGas'
import claimQueueEncode from './claimQueueEncode'
import type { ClaimQueueInput, ExtractClaimQueue } from './types'


export const createClaimQueue = (params: StakeWise.CommonParams): ExtractClaimQueue  => {
  const result = (values: StakeWise.ExtractInput<ClaimQueueInput>) => claimQueue({ ...params, ...values })
  result.encode = (values: StakeWise.ExtractInput<ClaimQueueInput>) => claimQueueEncode({ ...params, ...values })
  result.estimateGas = (values: StakeWise.ExtractInput<ClaimQueueInput>) => claimQueueGas({ ...params, ...values })

  return result
}

export type { ExtractClaimQueue } from './types'
