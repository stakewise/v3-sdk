import Utils from '../../../utils'
import { commonLogic } from './common'
import type { RescueAssetsInput } from './types'


const rescueAssetsEncode = async (values: RescueAssetsInput): Promise<StakeWise.TransactionData> => {
  const multicallArgs = commonLogic(values)

  const utils = new Utils(values)

  return utils.getVaultMulticallEncode(multicallArgs)
}


export default rescueAssetsEncode
