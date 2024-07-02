import { commonLogic } from './common'
import { vaultMulticall } from '../../../../contracts'
import claimExitQueueGas from './claimExitQueueGas'
import claimExitQueueEncode from './claimExitQueueEncode'
import type { ClaimExitQueue } from './types'


const claimExitQueue: ClaimExitQueue = async (values) => {
  const multicallArgs = commonLogic(values)

  const result = await vaultMulticall<{ hash: string }>(multicallArgs)

  return result.hash
}

claimExitQueue.encode = claimExitQueueEncode
claimExitQueue.estimateGas = claimExitQueueGas


export default claimExitQueue
