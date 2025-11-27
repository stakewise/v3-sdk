import { commonLogic } from './common'
import type { BurnInput } from './types'


const burn = async (values: BurnInput) => {
  const { shares, provider, userAddress } = values

  const vaultContract = commonLogic(values)

  const signer = await provider.getSigner(userAddress)
  const signedVaultContract = vaultContract.connect(signer)

  const result = await signedVaultContract.burnOsToken(shares)

  return result.hash
}


export default burn
