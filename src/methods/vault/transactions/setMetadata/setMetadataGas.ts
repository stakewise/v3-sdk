import { commonLogic } from './common'
import { getMulticallGas } from '../utils'
import type { SetMetadataInput } from './types'


type Input = SetMetadataInput & {
  provider: StakeWise.Provider
}

const setMetadataGas = ({ provider, ...values }: Input) => {
  const multicallArgs = commonLogic(values)

  return getMulticallGas({ ...multicallArgs, provider })
}


export default setMetadataGas
