import { commonLogic } from './common'
import { ClaimExitQueue } from './types'
import claimExitQueueGas from './claimExitQueueGas'
import { vaultMulticall } from '../../../../contracts'
import claimExitQueueEncode from './claimExitQueueEncode'


const claimExitQueue: ClaimExitQueue = async (values) => {
  const { params, multicallArgs } = await commonLogic(values)

  const result = await vaultMulticall<{ hash: string }>({
    ...multicallArgs,
    request: {
      params,
    },
  })

  return result.hash
}

claimExitQueue.encode = claimExitQueueEncode
claimExitQueue.estimateGas = claimExitQueueGas


export default claimExitQueue
