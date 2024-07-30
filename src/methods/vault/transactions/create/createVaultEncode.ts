import { commonLogic } from './common'
import type { CreateVaultInput } from './types'
import { uploadMetadata } from '../util'


const createVaultEncode = async (values: CreateVaultInput) => {
  const { image, displayName, description, ...rest } = values
  const { options } = rest

  const metadataIpfsHash = await uploadMetadata({ image, displayName, description, options })
  const { vaultFactory, params } = await commonLogic({ metadataIpfsHash, ...rest })

  const rx = await vaultFactory.createVault.populateTransaction(...params)

  return {
    to: rx.to,
    data: rx.data,
  }
}


export default createVaultEncode
