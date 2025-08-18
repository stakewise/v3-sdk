import { commonLogic } from './common'
import type { ClaimQueue } from './types'
import claimQueueGas from './claimQueueGas'
import claimQueueEncode from './claimQueueEncode'
import { boostMulticall } from '../../../../contracts'


const claimQueue: ClaimQueue = async (values) => {
  const multicallArgs = await commonLogic(values)

  const result = await boostMulticall<{ hash: string }>(multicallArgs)

  return result.hash
}

claimQueue.encode = claimQueueEncode
claimQueue.estimateGas = claimQueueGas


export default claimQueue
