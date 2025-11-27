import Utils from '../../../utils'
import { MintInput } from './types'
import { commonLogic } from './common'


const mintEncode = async (values: MintInput): Promise<StakeWise.TransactionData> => {
  const utils = new Utils(values)
  const multicallArgs = commonLogic(values)

  return utils.getVaultMulticallEncode(multicallArgs)
}


export default mintEncode
