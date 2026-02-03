import { commonLogic } from './common'
import { uploadMetadata } from '../util'
import type { CreateVaultInput } from './types'
import { wrapErrorHandler } from '../../../../helpers'


const create = async (values: CreateVaultInput) => {
  const { image, displayName, description, ...rest } = values
  const { provider, userAddress } = rest

  const metadataIpfsHash = await uploadMetadata(values)
  const { vaultFactory, params, isMetaVault } = await commonLogic({ metadataIpfsHash, ...rest })

  const signer = await provider.getSigner(userAddress)

  const signedContract = vaultFactory.connect(signer) as typeof isMetaVault extends true
    ? StakeWise.ABI.MetaVaultFactory
    : StakeWise.ABI.VaultFactory

  const response = await wrapErrorHandler(
    signedContract.createVault(...params),
    'transaction'
  )

  return response.hash
}


export default create
