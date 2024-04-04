import { commonLogic } from './common'
import type { WithdrawInput } from './types'
import { getVaultMulticallEncode } from '../../../utils'


const withdrawEncode = async (values: WithdrawInput): Promise<StakeWise.TransactionData> => {
  const multicallArgs = await commonLogic(values)

  return getVaultMulticallEncode(multicallArgs)
}


export default withdrawEncode
