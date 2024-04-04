import { getVaultMulticallEncode } from '../../../utils'
import type { MulticallInput } from './types'
import { commonLogic } from './common'


const multicallEncode = (values: MulticallInput): Promise<StakeWise.TransactionData> => {
  const multicallArgs = commonLogic(values)

  return getVaultMulticallEncode(multicallArgs)
}


export default multicallEncode
