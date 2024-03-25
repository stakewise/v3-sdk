import { getMulticallEncode } from '../utils'
import { commonLogic } from './common'
import type { ClaimExitQueueInput } from './types'


const claimExitQueueEncode = (values: ClaimExitQueueInput) => {
  const multicallArgs = commonLogic(values)

  return getMulticallEncode(multicallArgs)
}


export default claimExitQueueEncode
