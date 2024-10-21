import boostGas from './boostGas'
import type { Boost } from './types'
import boostEncode from './boostEncode'
import { commonLogic } from './common'
import { boostMulticall } from '../../../../contracts'


const boost: Boost = async (values) => {
  const multicallArgs = commonLogic(values)

  const result = await boostMulticall<{ hash: string }>(multicallArgs)

  return result.hash
}

boost.encode = boostEncode
boost.estimateGas = boostGas


export default boost
