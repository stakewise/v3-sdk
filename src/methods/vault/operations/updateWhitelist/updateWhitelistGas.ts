import { commonLogic } from './common'
import { getMulticallGas } from '../../utils'
import type { UpdateWhitelistInput } from './types'


type Input = UpdateWhitelistInput & {
  provider: StakeWise.Provider
}

const setMetadataGas = ({ provider, ...values }: Input) => {
  const multicallArgs = commonLogic(values)

  return getMulticallGas({ ...multicallArgs, provider })
}


export default setMetadataGas
