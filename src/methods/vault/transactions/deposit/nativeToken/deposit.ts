import depositGas from './depositGas'
import type { Deposit } from '../types'
import depositEncode from './depositEncode'
import { commonLogic, referrer } from './common'
import getHarvestParams from '../../../requests/getHarvestParams'


const deposit: Deposit = async (values) => {
  const { options, provider, vaultAddress, userAddress } = values

  const { params, canHarvest } = await getHarvestParams({ options, vaultAddress })
  const { vaultContract, overrides } = await commonLogic(values)

  const signer = await provider.getSigner(userAddress)
  const signedContract = vaultContract.connect(signer)

  if (canHarvest) {
    const response = await signedContract.updateStateAndDeposit(userAddress, referrer, params, overrides)

    return response.hash
  }
  else {
    const response = await signedContract.deposit(userAddress, referrer, overrides)

    return response.hash
  }
}

deposit.encode = depositEncode
deposit.estimateGas = depositGas


export default deposit
