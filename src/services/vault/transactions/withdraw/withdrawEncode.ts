import Utils from '../../../utils'
import { commonLogic } from './common'
import type { WithdrawInput } from './types'


const withdrawEncode = async (values: WithdrawInput): Promise<StakeWise.TransactionData> => {
  const multicallArgs = await commonLogic(values)

  const utils = new Utils(values)

  return utils.getVaultMulticallEncode(multicallArgs)
}


export default withdrawEncode
