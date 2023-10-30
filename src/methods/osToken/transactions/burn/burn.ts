import burnGas from './burnGas'
import type { Burn } from './types'
import burnEncode from './burnEncode'
import { commonLogic } from './common'


const burn: Burn = async (values) => {
  const { shares, provider, userAddress } = values

  const vaultContract = commonLogic(values)

  const signer = await provider.getSigner(userAddress)
  const signedVaultContract = vaultContract.connect(signer)

  const result = await signedVaultContract.burnOsToken(shares)

  return result.hash
}

burn.encode = burnEncode
burn.estimateGas = burnGas


export default burn
