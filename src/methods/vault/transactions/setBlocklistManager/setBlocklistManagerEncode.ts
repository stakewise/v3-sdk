import { getMulticallEncode } from '../utils'
import type { SetBlocklistManagerInput } from './types'
import { commonLogic } from './common'


const setBlocklistManagerEncode = (values: SetBlocklistManagerInput): Promise<StakeWise.TransactionData> => {
  const multicallArgs = commonLogic(values)

  return getMulticallEncode(multicallArgs)
}


export default setBlocklistManagerEncode
