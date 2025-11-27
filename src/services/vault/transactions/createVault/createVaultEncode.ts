import { commonLogic } from './common'
import { uploadMetadata } from '../util'
import type { CreateVaultInput } from './types'


const createVaultEncode = async (values: CreateVaultInput) => {
  const { image, displayName, description, ...rest } = values

  const metadataIpfsHash = await uploadMetadata(values)
  const { vaultFactory, params } = await commonLogic({ metadataIpfsHash, ...rest })

  return vaultFactory.createVault.populateTransaction(...params)
}


export default createVaultEncode
