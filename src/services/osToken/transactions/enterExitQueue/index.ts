import enterExitQueue from './enterExitQueue'
import enterExitQueueGas from './enterExitQueueGas'
import enterExitQueueEncode from './enterExitQueueEncode'
import type { EnterExitQueueInput, ExtractEnterExitQueue } from './types'


export const createEnterExitQueue = (params: StakeWise.CommonParams): ExtractEnterExitQueue => {
  const result = (values: StakeWise.ExtractInput<EnterExitQueueInput>) => enterExitQueue({ ...params, ...values })
  result.encode = (values: StakeWise.ExtractInput<EnterExitQueueInput>) => enterExitQueueEncode({ ...params, ...values })
  result.estimateGas = (values: StakeWise.ExtractInput<EnterExitQueueInput>) => enterExitQueueGas({ ...params, ...values })

  return result
}

export type { ExtractEnterExitQueue } from './types'
