import { commonLogic } from './common'
import type { DepositInput } from '../types'
import { sendWithGasMargin } from '../../../../../helpers'


const deposit = async (values: DepositInput) => {
  const { provider, userAddress } = values

  const { vaultContract, baseParams, updateStateParams, canHarvest } = await commonLogic(values)

  const signer = await provider.getSigner(userAddress)
  const signedContract = vaultContract.connect(signer)

  if (canHarvest) {
    const response = await sendWithGasMargin(signedContract.updateStateAndDeposit, updateStateParams)

    return response.hash
  }
  else {
    const response = await sendWithGasMargin(signedContract.deposit, baseParams)

    return response.hash
  }
}


export default deposit
