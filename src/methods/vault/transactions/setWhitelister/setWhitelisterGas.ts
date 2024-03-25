import { commonLogic } from './common'
import { getMulticallGas } from '../utils'
import type { SetWhitelisterInput } from './types'


type Input = SetWhitelisterInput & {
  provider: StakeWise.Provider
}

const setWhitelisterGas = ({ provider, ...values }: Input) => {
  const multicallArgs = commonLogic(values)

  return getMulticallGas({ ...multicallArgs, provider })
}


export default setWhitelisterGas
