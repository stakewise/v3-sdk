import { commonLogic } from './common'
import type { WithdrawInput } from './types'
import { getMulticallEncode } from '../../utils'


const withdrawEncode = async (values: WithdrawInput): Promise<StakeWise.TransactionData> => {
  const multicallArgs = await commonLogic(values)

  return getMulticallEncode(multicallArgs)
}


export default withdrawEncode
