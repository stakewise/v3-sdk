import Utils from '../../../utils'
import { commonLogic } from './common'
import type { ClaimExitQueueInput } from './types'


const claimExitQueueGas = (values: ClaimExitQueueInput) => {
  const utils = new Utils(values)
  const multicallArgs = commonLogic(values)

  return utils.getVaultMulticallGas(multicallArgs)
}


export default claimExitQueueGas
