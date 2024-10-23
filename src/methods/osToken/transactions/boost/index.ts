import boostGas from './boostGas'
import boostEncode from './boostEncode'
import type { Boost } from './types'
import { commonLogic } from './common'
import { boostMulticall } from '../../../../contracts'


const boost: Boost = async (values) => {
  const multicallArgs = await commonLogic(values)

  const result = await boostMulticall<{ hash: string }>(multicallArgs)

  return result.hash
}

boost.encode = boostEncode
boost.estimateGas = boostGas


export default boost
