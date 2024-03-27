import { getMulticallEncode } from '../../utils'
import type { SetValidatorsRootInput } from './types'
import { commonLogic } from './common'


const setValidatorsRootEncode = (values: SetValidatorsRootInput): Promise<StakeWise.TransactionData> => {
  const multicallArgs = commonLogic(values)

  return getMulticallEncode(multicallArgs)
}


export default setValidatorsRootEncode
