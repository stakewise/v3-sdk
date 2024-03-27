import { getMulticallEncode } from '../../utils'
import type { SetKeysManagerInput } from './types'
import { commonLogic } from './common'


const setKeysManagerEncode = (values: SetKeysManagerInput): Promise<StakeWise.TransactionData> => {
  const multicallArgs = commonLogic(values)

  return getMulticallEncode(multicallArgs)
}


export default setKeysManagerEncode
