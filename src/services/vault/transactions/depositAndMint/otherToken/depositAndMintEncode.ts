import Utils from '../../../../utils'
import { commonLogic } from './common'
import { DepositAndMintInput } from '../types'


const depositAndMintEncode = async (values: DepositAndMintInput): Promise<StakeWise.TransactionData> => {
  const multicallArgs = commonLogic(values)

  const utils = new Utils(values)

  return utils.getVaultMulticallEncode(multicallArgs)
}


export default depositAndMintEncode
