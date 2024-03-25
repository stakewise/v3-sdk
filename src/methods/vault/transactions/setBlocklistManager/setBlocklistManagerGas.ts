import { commonLogic } from './common'
import { getMulticallGas } from '../utils'
import type { SetBlocklistManagerInput } from './types'


type Input = SetBlocklistManagerInput & {
  provider: StakeWise.Provider
}

const setBlocklistManagerGas = ({ provider, ...values }: Input) => {
  const multicallArgs = commonLogic(values)

  return getMulticallGas({ ...multicallArgs, provider })
}


export default setBlocklistManagerGas
