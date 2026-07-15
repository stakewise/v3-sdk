import Utils from '../../../utils'
import { commonLogic } from './common'
import type { BurnAndWithdrawInput } from './types'


const burnAndWithdrawEncode = async (values: BurnAndWithdrawInput): Promise<StakeWise.TransactionData> => {
  const multicallArgs = await commonLogic(values)

  const utils = new Utils(values)

  return utils.getVaultMulticallEncode(multicallArgs)
}


export default burnAndWithdrawEncode
