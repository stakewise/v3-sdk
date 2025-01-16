import lockGas from './lockGas'
import lockEncode from './lockEncode'
import type { Lock } from './types'
import { commonLogic } from './common'
import { boostMulticall } from '../../../../contracts'


const lock: Lock = async (values) => {
  const multicallArgs = await commonLogic(values)

  const result = await boostMulticall<{ hash: string }>(multicallArgs)

  return result.hash
}

lock.encode = lockEncode
lock.estimateGas = lockGas


export default lock
