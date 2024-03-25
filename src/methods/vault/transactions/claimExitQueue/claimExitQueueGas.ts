import { commonLogic } from './common'
import { getMulticallGas } from '../utils'
import type { ClaimExitQueueInput } from './types'


type Input = ClaimExitQueueInput & {
  provider: StakeWise.Provider
}

const claimExitQueueGas = ({ provider, ...values }: Input) => {
  const multicallArgs = commonLogic(values)

  return getMulticallGas({ ...multicallArgs, provider })
}


export default claimExitQueueGas
