import { getMulticallEncode } from '../../utils'
import type { MulticallInput } from './types'
import { commonLogic } from './common'


const multicallEncode = (values: MulticallInput): Promise<StakeWise.TransactionData> => {
  const multicallArgs = commonLogic(values)

  return getMulticallEncode(multicallArgs)
}


export default multicallEncode
