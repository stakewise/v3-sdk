import { commonLogic } from './common'
import { getMetadataHashMock } from '../util'
import type { CreateVaultInput } from './types'
import { getGas, wrapErrorHandler } from '../../../../helpers'


const createVaultGas = async (values: CreateVaultInput) => {
  const { image, displayName, description, ...rest } = values
  const { provider, userAddress } = rest

  const metadataIpfsHash = getMetadataHashMock({ image, displayName, description })
  const { vaultFactory, params } = await commonLogic({ metadataIpfsHash, ...rest })

  const signer = await provider.getSigner(userAddress)
  const signedContract = vaultFactory.connect(signer)

  const estimatedGas = await wrapErrorHandler(
    signedContract.createVault.estimateGas(...params),
    'gas'
  )

  return getGas({ estimatedGas, provider })
}


export default createVaultGas
