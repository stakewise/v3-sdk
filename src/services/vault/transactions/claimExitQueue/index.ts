import claimExitQueue from './claimExitQueue'
import claimExitQueueGas from './claimExitQueueGas'
import claimExitQueueEncode from './claimExitQueueEncode'
import type { ClaimExitQueueInput, ExtractClaimExitQueue } from './types'


export const createClaimExitQueue = (params: StakeWise.CommonParams): ExtractClaimExitQueue  => {
  const result = (values: StakeWise.ExtractInput<ClaimExitQueueInput>) => claimExitQueue({ ...params, ...values })
  result.encode = (values: StakeWise.ExtractInput<ClaimExitQueueInput>) => claimExitQueueEncode({ ...params, ...values })
  result.estimateGas = (values: StakeWise.ExtractInput<ClaimExitQueueInput>) => claimExitQueueGas({ ...params, ...values })

  return result
}

export type { ExtractClaimExitQueue } from './types'
