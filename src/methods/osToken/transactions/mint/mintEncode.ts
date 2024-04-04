import { MintInput } from './types'
import { commonLogic } from './common'
import { getVaultMulticallEncode } from '../../../utils'


const mintEncode = async (values: MintInput): Promise<StakeWise.TransactionData> => {
  const multicallArgs = commonLogic(values)

  return getVaultMulticallEncode(multicallArgs)
}


export default mintEncode
