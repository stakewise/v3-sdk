import { commonLogic } from './common'
import type { BurnInput } from './types'
import { wrapErrorHandler } from '../../../../helpers'


const burn = async (values: BurnInput) => {
  const { shares, provider, userAddress } = values

  const vaultContract = commonLogic(values)

  const signer = await provider.getSigner(userAddress)
  const signedVaultContract = vaultContract.connect(signer)

  const estimatedGas = await wrapErrorHandler(
    signedVaultContract.burnOsToken.estimateGas(shares),
    'transaction'
  )

  // If another osToken transaction is in the last block, the estimate skips the controller update,
  // but our transaction lands in a later block and pays for it, so we add 30%
  const gasLimit = estimatedGas * 130n / 100n

  const result = await wrapErrorHandler(
    signedVaultContract.burnOsToken(shares, { gasLimit }),
    'transaction'
  )

  return result.hash
}


export default burn
