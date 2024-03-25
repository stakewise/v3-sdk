import { getMulticallEncode } from '../utils'
import type { SetMetadataInput } from './types'
import { commonLogic } from './common'


const setMetadataEncode = (values: SetMetadataInput): Promise<StakeWise.TransactionData> => {
  const multicallArgs = commonLogic(values)

  return getMulticallEncode(multicallArgs)
}


export default setMetadataEncode
