import { getMulticallEncode } from '../../utils'
import type { SetFeeRecipientInput } from './types'
import { commonLogic } from './common'


const setFeeRecipientEncode = (values: SetFeeRecipientInput): Promise<StakeWise.TransactionData> => {
  const multicallArgs = commonLogic(values)

  return getMulticallEncode(multicallArgs)
}


export default setFeeRecipientEncode
