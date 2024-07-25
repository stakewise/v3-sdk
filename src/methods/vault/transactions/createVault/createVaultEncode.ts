import { commonLogic } from './common'
import type { CreateVaultInput } from './types'
import { getMetadataHashMock } from '../util'


const depositEncode = async (values: CreateVaultInput) => {
  const { image, displayName, description, ...rest } = values

  const metadataIpfsHash = getMetadataHashMock({ image, displayName, description })
  const { vaultFactory, params } = await commonLogic({ metadataIpfsHash, ...rest })

  const rx = await vaultFactory.createVault.populateTransaction(...params)

  return {
    to: rx.to,
    data: rx.data,
  }
}


export default depositEncode
