import { commonLogic } from './common'
import { getMulticallGas } from '../../utils'
import type { SetValidatorsRootInput } from './types'


type Input = SetValidatorsRootInput & {
  provider: StakeWise.Provider
}

const setValidatorsRootGas = ({ provider, ...values }: Input) => {
  const multicallArgs = commonLogic(values)

  return getMulticallGas({ ...multicallArgs, provider })
}


export default setValidatorsRootGas
