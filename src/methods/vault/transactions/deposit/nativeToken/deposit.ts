import depositGas from './depositGas'
import depositEncode from './depositEncode'
import { commonLogic } from './common'
import type { Deposit } from '../types'


const deposit: Deposit = async (values) => {
  const { provider, userAddress } = values

  const { vaultContract, baseParams, updateStateParams, canHarvest } = await commonLogic(values)

  const signer = await provider.getSigner(userAddress)
  const signedContract = vaultContract.connect(signer)

  if (canHarvest && updateStateParams) {
    const response = await signedContract.updateStateAndDeposit(...updateStateParams)

    return response.hash
  }
  else {
    const response = await signedContract.deposit(...baseParams)

    return response.hash
  }
}

deposit.encode = depositEncode
deposit.estimateGas = depositGas


export default deposit
