import unlockGas from './unlockGas'
import type { Unlock } from './types'
import { commonLogic } from './common'
import unlockEncode from './unlockEncode'
import { boostMulticall } from '../../../../contracts'


const unlock: Unlock = async (values) => {
  const multicallArgs = commonLogic(values)

  const result = await boostMulticall<{ hash: string }>(multicallArgs)

  return result.hash
}

unlock.encode = unlockEncode
unlock.estimateGas = unlockGas


export default unlock
