import { commonLogic } from './common'
import { getGas } from '../../../../utils'
import type { CreateVaultInput } from './types'
import { getMetadataHashMock } from '../util'


const createVaultGas = async (values: CreateVaultInput) => {
  const { image, displayName, description, ...rest } = values
  const { provider, userAddress } = rest

  const metadataIpfsHash = getMetadataHashMock({ image, displayName, description })
  const { vaultFactory, params } = await commonLogic({ metadataIpfsHash, ...rest })

  const signer = await provider.getSigner(userAddress)
  const signedContract = vaultFactory.connect(signer)

  const estimatedGas = await signedContract.createVault.estimateGas(...params)

  return getGas({ estimatedGas, provider })
}


export default createVaultGas
