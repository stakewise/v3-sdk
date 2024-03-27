import { commonLogic } from './common'
import { getMulticallEncode } from '../../utils'
import type { UpdateWhitelistInput } from './types'


const setMetadataEncode = (values: UpdateWhitelistInput): Promise<StakeWise.TransactionData> => {
  const multicallArgs = commonLogic(values)

  return getMulticallEncode(multicallArgs)
}


export default setMetadataEncode
