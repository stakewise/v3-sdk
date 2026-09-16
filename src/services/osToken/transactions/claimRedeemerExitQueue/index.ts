import claimRedeemerExitQueue from './claimRedeemerExitQueue'
import claimRedeemerExitQueueGas from './claimRedeemerExitQueueGas'
import claimRedeemerExitQueueEncode from './claimRedeemerExitQueueEncode'
import type { ClaimRedeemerExitQueueInput, ExtractClaimRedeemerExitQueue } from './types'


export const createClaimRedeemerExitQueue = (params: StakeWise.CommonParams): ExtractClaimRedeemerExitQueue => {
  const result = (values: StakeWise.ExtractInput<ClaimRedeemerExitQueueInput>) => claimRedeemerExitQueue({ ...params, ...values })
  result.encode = (values: StakeWise.ExtractInput<ClaimRedeemerExitQueueInput>) => claimRedeemerExitQueueEncode({ ...params, ...values })
  result.estimateGas = (values: StakeWise.ExtractInput<ClaimRedeemerExitQueueInput>) => claimRedeemerExitQueueGas({ ...params, ...values })

  return result
}

export type { ExtractClaimRedeemerExitQueue } from './types'
