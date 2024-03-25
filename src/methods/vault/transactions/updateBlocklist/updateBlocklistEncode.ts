import { commonLogic } from './common'
import { getMulticallEncode } from '../utils'
import type { UpdateBlocklistInput } from './types'


const setMetadataEncode = (values: UpdateBlocklistInput): Promise<StakeWise.TransactionData> => {
  const multicallArgs = commonLogic(values)

  return getMulticallEncode(multicallArgs)
}


export default setMetadataEncode
