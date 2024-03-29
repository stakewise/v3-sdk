import { commonLogic } from './common'
import { getMulticallGas } from '../../utils'
import type { ClaimExitQueueInput } from './types'


const claimExitQueueGas = (values: ClaimExitQueueInput) => {
  const { provider } = values

  const multicallArgs = commonLogic(values)

  return getMulticallGas({ ...multicallArgs, provider })
}


export default claimExitQueueGas
