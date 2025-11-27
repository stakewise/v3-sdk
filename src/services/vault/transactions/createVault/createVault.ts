import { commonLogic } from './common'
import { uploadMetadata } from '../util'
import type { CreateVaultInput } from './types'


const create = async (values: CreateVaultInput) => {
  const { image, displayName, description, ...rest } = values
  const { provider, userAddress } = rest

  const metadataIpfsHash = await uploadMetadata(values)
  const { vaultFactory, params } = await commonLogic({ metadataIpfsHash, ...rest })

  const signer = await provider.getSigner(userAddress)
  const signedContract = vaultFactory.connect(signer)

  const response = await signedContract.createVault(...params)

  return response.hash
}


export default create
