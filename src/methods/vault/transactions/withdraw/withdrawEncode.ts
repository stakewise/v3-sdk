import { commonLogic } from './common'
import { WithdrawInput } from './types'
import { getMulticallEncode } from '../utils'


const withdrawEncode = async (values: WithdrawInput): Promise<StakeWise.TransactionData> => {
  const multicallArgs = await commonLogic(values)

  return getMulticallEncode(multicallArgs)
}


export default withdrawEncode
