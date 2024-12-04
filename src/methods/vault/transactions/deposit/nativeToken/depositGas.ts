import { getGas } from '../../../../../utils'
import type { DepositInput } from '../types'
import { commonLogic } from './common'


const depositGas = async (values: DepositInput) => {
  const { provider, userAddress } = values

  const { vaultContract, params, canHarvest } = await commonLogic(values)

  const signer = await provider.getSigner(userAddress)
  const signedContract = vaultContract.connect(signer)

  let estimatedGas = 0n

  if (canHarvest) {
    estimatedGas = await signedContract.updateStateAndDeposit.estimateGas(...params)
  }
  else {
    estimatedGas = await signedContract.deposit.estimateGas(...params)
  }

  return getGas({ estimatedGas, provider })
}


export default depositGas
