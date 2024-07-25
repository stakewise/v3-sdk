import { commonLogic } from './common'
import createVaultGas from './createVaultGas'
import createVaultEncode from './createVaultEncode'
import { uploadMetadata } from '../util'
import type { CreateVault } from './types'


const createVault: CreateVault = async (values) => {
  const { image, displayName, description, ...rest } = values
  const { provider, options, userAddress } = rest

  const metadataIpfsHash = await uploadMetadata({ image, displayName, description, options })
  const { vaultFactory, params } = await commonLogic({ metadataIpfsHash, ...rest })

  const signer = await provider.getSigner(userAddress)
  const signedContract = vaultFactory.connect(signer)

  const response = await signedContract.createVault(...params)

  return response.hash
}

createVault.encode = createVaultEncode
createVault.estimateGas = createVaultGas


export default createVault
