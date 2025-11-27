import Utils from '../../../utils'
import { commonLogic } from './common'
import type { ClaimExitQueueInput } from './types'


const claimExitQueueEncode = (values: ClaimExitQueueInput) => {
  const multicallArgs = commonLogic(values)
  const utils = new Utils(values)

  return utils.getVaultMulticallEncode(multicallArgs)
}


export default claimExitQueueEncode
