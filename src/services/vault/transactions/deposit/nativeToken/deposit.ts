import { commonLogic } from './common'
import type { DepositInput } from '../types'


const deposit = async (values: DepositInput) => {
  const { provider, userAddress } = values

  const { vaultContract, baseParams, updateStateParams, canHarvest } = await commonLogic(values)

  const signer = await provider.getSigner(userAddress)
  const signedContract = vaultContract.connect(signer)

  if (canHarvest) {
    const response = await signedContract.updateStateAndDeposit(...updateStateParams)

    return response.hash as string
  }
  else {
    const response = await signedContract.deposit(...baseParams)

    return response.hash as string
  }
}


export default deposit
