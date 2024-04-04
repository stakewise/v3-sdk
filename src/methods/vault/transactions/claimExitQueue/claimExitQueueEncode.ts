import { getVaultMulticallEncode } from '../../../utils'
import { commonLogic } from './common'
import type { ClaimExitQueueInput } from './types'


const claimExitQueueEncode = (values: ClaimExitQueueInput) => {
  const multicallArgs = commonLogic(values)

  return getVaultMulticallEncode(multicallArgs)
}


export default claimExitQueueEncode
