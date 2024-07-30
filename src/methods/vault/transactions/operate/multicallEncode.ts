import { commonLogic } from './common'
import type { MulticallInput } from './types'
import { uploadMetadata } from '../util'
import { getVaultMulticallEncode } from '../../../utils'


const multicallEncode = async (values: MulticallInput): Promise<StakeWise.TransactionData> => {
  const { image, displayName, description, ...rest } = values
  const { options } = rest

  const metadataIpfsHash = await uploadMetadata({ image, displayName, description, options })
  const multicallArgs = await commonLogic({ metadataIpfsHash, ...rest })

  return getVaultMulticallEncode(multicallArgs)
}


export default multicallEncode
