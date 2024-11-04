import unboostGas from './unboostGas'
import unboostEncode from './unboostEncode'
import type { Boost } from './types'
import { commonLogic } from './common'
import { boostMulticall } from '../../../../contracts'


const unboost: Boost = async (values) => {
  const multicallArgs = commonLogic(values)

  const result = await boostMulticall<{ hash: string }>(multicallArgs)

  return result.hash
}

unboost.encode = unboostEncode
unboost.estimateGas = unboostGas


export default unboost
