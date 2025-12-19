import { commonLogic } from './common'
import type { BurnInput } from './types'
import { wrapErrorHandler } from '../../../../helpers'


const burn = async (values: BurnInput) => {
  const { shares, provider, userAddress } = values

  const vaultContract = commonLogic(values)

  const signer = await provider.getSigner(userAddress)
  const signedVaultContract = vaultContract.connect(signer)

  const result = await wrapErrorHandler(
    signedVaultContract.burnOsToken(shares),
    'transaction'
  )

  return result.hash
}


export default burn
