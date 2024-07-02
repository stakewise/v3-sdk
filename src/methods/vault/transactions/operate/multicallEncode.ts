import { getVaultMulticallEncode } from '../../../utils'
import type { MulticallInput } from './types'
import { commonLogic } from './common'


const multicallEncode = async (values: MulticallInput): Promise<StakeWise.TransactionData> => {
  const multicallArgs = await commonLogic(values)

  return getVaultMulticallEncode(multicallArgs)
}


export default multicallEncode
