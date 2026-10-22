import { commonLogic } from './common'
import type { BurnInput } from './types'
import { sendWithGasMargin } from '../../../../helpers'


const gasMarginPercent = 30n

const burn = async (values: BurnInput) => {
  const { shares, provider, userAddress } = values

  const vaultContract = commonLogic(values)

  const signer = await provider.getSigner(userAddress)
  const signedVaultContract = vaultContract.connect(signer)

  // If another osToken transaction is in the last block, the estimate skips the controller update,
  // but our transaction lands in a later block and pays for it, so we add 30%
  const result = await sendWithGasMargin(signedVaultContract.burnOsToken, [ shares ], gasMarginPercent)

  return result.hash
}


export default burn
