import type { OperateInput } from './types'
import { uploadMetadata } from '../util'
import { commonLogic } from './common'
import Utils from '../../../utils'


const operateEncode = async (values: OperateInput): Promise<StakeWise.TransactionData> => {
  const { image, displayName, description, ...rest } = values

  const utils = new Utils(values)
  const metadataIpfsHash = await uploadMetadata(values)
  const multicallArgs = await commonLogic({ metadataIpfsHash, ...rest })

  return utils.getVaultMulticallEncode(multicallArgs)
}


export default operateEncode
