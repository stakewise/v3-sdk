import Utils from '../../../../utils'
import { commonLogic } from './common'
import { DepositInput } from '../types'


const depositEncode = async (values: DepositInput): Promise<StakeWise.TransactionData> => {
  const multicallArgs = commonLogic(values)

  const utils = new Utils(values)

  return utils.getVaultMulticallEncode(multicallArgs)
}


export default depositEncode
