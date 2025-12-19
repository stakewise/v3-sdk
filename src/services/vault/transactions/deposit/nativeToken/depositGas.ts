import { getGas, wrapErrorHandler } from '../../../../../helpers'
import type { DepositInput } from '../types'
import { commonLogic } from './common'


const depositGas = async (values: DepositInput) => {
  const { provider, userAddress } = values

  const { vaultContract, baseParams, updateStateParams, canHarvest } = await commonLogic(values)

  const signer = await provider.getSigner(userAddress)
  const signedContract = vaultContract.connect(signer)

  let estimatedGas = 0n

  if (canHarvest) {
    estimatedGas = await wrapErrorHandler(
      signedContract.updateStateAndDeposit.estimateGas(...updateStateParams),
      'gas'
    )
  }
  else {
    estimatedGas = await wrapErrorHandler(
      signedContract.deposit.estimateGas(...baseParams),
      'gas'
    )
  }

  return getGas({ estimatedGas, provider })
}


export default depositGas
