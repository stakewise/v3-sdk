import { commonLogic } from './common'
import type { DepositAndMintInput } from '../types'
import { sendWithGasMargin } from '../../../../../helpers'


const depositAndMint = async (values: DepositAndMintInput) => {
  const { provider, userAddress } = values

  const { vaultContract, baseParams, updateStateParams, canHarvest } = await commonLogic(values)

  const signer = await provider.getSigner(userAddress)
  const signedContract = vaultContract.connect(signer)

  if (canHarvest) {
    const response = await sendWithGasMargin(signedContract.updateStateAndDepositAndMintOsToken, updateStateParams)

    return response.hash
  }
  else {
    const response = await sendWithGasMargin(signedContract.depositAndMintOsToken, baseParams)

    return response.hash
  }
}


export default depositAndMint
