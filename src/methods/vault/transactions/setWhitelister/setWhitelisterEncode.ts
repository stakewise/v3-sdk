import { getMulticallEncode } from '../utils'
import type { SetWhitelisterInput } from './types'
import { commonLogic } from './common'


const setWhitelisterEncode = (values: SetWhitelisterInput): Promise<StakeWise.TransactionData> => {
  const multicallArgs = commonLogic(values)

  return getMulticallEncode(multicallArgs)
}


export default setWhitelisterEncode
