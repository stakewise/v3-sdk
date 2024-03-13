import depositGas from './depositGas'
import type { Deposit } from '../types'
import depositEncode from './depositEncode'
import { commonLogic, referrer } from './common'
import { getNetworkTypes } from '../../../../../utils'
import getHarvestParams from '../../../requests/getHarvestParams'


const deposit: Deposit = async (values) => {
  const { options, provider, vaultAddress, userAddress } = values

  const { vaultContract, canHarvest, overrides } = await commonLogic(values)

  const signer = await provider.getSigner(userAddress)
  const signedContract = vaultContract.connect(signer)

  const { isGnosis } = getNetworkTypes(options)

  if (canHarvest) {
    const harvestParams = await getHarvestParams({ options, vaultAddress })

    const response = await signedContract.updateStateAndDeposit(userAddress, referrer, harvestParams, overrides)

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
