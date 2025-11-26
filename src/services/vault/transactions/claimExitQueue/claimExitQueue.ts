import { commonLogic } from './common'
import type { ClaimExitQueueInput } from './types'
import { vaultMulticall } from '../../../../contracts'


const claimExitQueue = async (values: ClaimExitQueueInput) => {
  const multicallArgs = commonLogic(values)

  const result = await vaultMulticall<{ hash: string }>(multicallArgs)

  return result.hash
}


export default claimExitQueue
