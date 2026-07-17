import { getGas, wrapErrorHandler } from '../../../../../helpers'
import type { DepositAndMintInput } from '../types'
import { commonLogic } from './common'


const depositAndMintGas = async (values: DepositAndMintInput) => {
  const { provider, userAddress } = values

  const { vaultContract, baseParams, updateStateParams, canHarvest } = await commonLogic(values)

  const signer = await provider.getSigner(userAddress)
  const signedContract = vaultContract.connect(signer)

  let estimatedGas = 0n

  if (canHarvest) {
    estimatedGas = await wrapErrorHandler(
      signedContract.updateStateAndDepositAndMintOsToken.estimateGas(...updateStateParams),
      'gas'
    )
  }
  else {
    estimatedGas = await wrapErrorHandler(
      signedContract.depositAndMintOsToken.estimateGas(...baseParams),
      'gas'
    )
  }

  return getGas({ estimatedGas, provider })
}


export default depositAndMintGas
