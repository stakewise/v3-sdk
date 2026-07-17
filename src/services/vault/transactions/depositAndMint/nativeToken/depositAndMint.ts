import { commonLogic } from './common'
import type { DepositAndMintInput } from '../types'
import { wrapErrorHandler } from '../../../../../helpers'


const depositAndMint = async (values: DepositAndMintInput) => {
  const { provider, userAddress } = values

  const { vaultContract, baseParams, updateStateParams, canHarvest } = await commonLogic(values)

  const signer = await provider.getSigner(userAddress)
  const signedContract = vaultContract.connect(signer)

  if (canHarvest) {
    const response = await wrapErrorHandler(
      signedContract.updateStateAndDepositAndMintOsToken(...updateStateParams),
      'transaction'
    )

    return response.hash
  }
  else {
    const response = await wrapErrorHandler(
      signedContract.depositAndMintOsToken(...baseParams),
      'transaction'
    )

    return response.hash
  }
}


export default depositAndMint
