import { commonLogic } from './common'
import type { CreateVaultInput } from './types'
import { getMetadataHashMock } from '../util'


const createVaultStaticCall = async (values: CreateVaultInput) => {
  const { image, displayName, description, ...rest } = values
  const { provider, userAddress } = rest

  const metadataIpfsHash = getMetadataHashMock({ image, displayName, description })
  const { vaultFactory, params } = await commonLogic({ metadataIpfsHash, ...rest })

  const signer = await provider.getSigner(userAddress)
  const signedContract = vaultFactory.connect(signer)

  const vaultAddress = await signedContract.createVault.staticCall(...params)

  return vaultAddress
}


export default createVaultStaticCall
