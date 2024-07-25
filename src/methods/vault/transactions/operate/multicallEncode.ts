import { commonLogic } from './common'
import type { MulticallInput } from './types'
import { getMetadataHashMock } from '../util'
import { getVaultMulticallEncode } from '../../../utils'


const multicallEncode = async (values: MulticallInput): Promise<StakeWise.TransactionData> => {
  const { image, displayName, description, ...rest } = values

  const metadataIpfsHash = getMetadataHashMock({ image, displayName, description })
  const multicallArgs = await commonLogic({ metadataIpfsHash, ...rest })

  return getVaultMulticallEncode(multicallArgs)
}


export default multicallEncode
