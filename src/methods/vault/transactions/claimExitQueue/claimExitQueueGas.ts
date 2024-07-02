import { commonLogic } from './common'
import { getVaultMulticallGas } from '../../../utils'
import type { ClaimExitQueueInput } from './types'


const claimExitQueueGas = (values: ClaimExitQueueInput) => {
  const { provider } = values

  const multicallArgs = commonLogic(values)

  return getVaultMulticallGas({ ...multicallArgs, provider })
}


export default claimExitQueueGas
