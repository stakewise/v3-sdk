import { commonLogic } from './common'
import type { ClaimQueueInput } from './types'
import { boostMulticall } from '../../../../contracts'


const claimQueue = async (values: ClaimQueueInput) => {
  const multicallArgs = await commonLogic(values)

  const result = await boostMulticall<{ hash: string }>(multicallArgs)

  return result.hash
}


export default claimQueue
