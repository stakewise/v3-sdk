import { commonLogic } from './common'
import type { DepositInput } from '../types'
import { handleContractError } from '../../../../../helpers'


const deposit = async (values: DepositInput) => {
  const { provider, userAddress } = values

  const { vaultContract, baseParams, updateStateParams, canHarvest } = await commonLogic(values)

  const signer = await provider.getSigner(userAddress)
  const signedContract = vaultContract.connect(signer)

  if (canHarvest) {
    const response = await handleContractError(
      signedContract.updateStateAndDeposit(...updateStateParams),
      'transaction'
    )

    return response.hash
  }
  else {
    const response = await  handleContractError(
      signedContract.deposit(...baseParams),
      'transaction'
    )

    return response.hash
  }
}


export default deposit
