import { commonLogic } from './common'
import type { CreateVaultInput } from './types'
import { uploadMetadata } from '../util'


const createVaultEncode = async (values: CreateVaultInput) => {
  const { image, displayName, description, ...rest } = values
  const { options } = rest

  const metadataIpfsHash = await uploadMetadata({ image, displayName, description, options })
  const { vaultFactory, params } = await commonLogic({ metadataIpfsHash, ...rest })

  return vaultFactory.createVault.populateTransaction(...params)
}


export default createVaultEncode
