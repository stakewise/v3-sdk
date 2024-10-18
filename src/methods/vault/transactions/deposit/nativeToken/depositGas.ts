import { getGas } from '../../../../../utils'
import type { DepositInput } from '../types'
import { commonLogic, referrer } from './common'
import getHarvestParams from '../../../requests/getHarvestParams'


const depositGas = async (values: DepositInput) => {
  const { options, provider, vaultAddress, userAddress } = values

  const { vaultContract, overrides } = await commonLogic(values)
  const { params, canHarvest } = await getHarvestParams({ options, vaultAddress })

  const signer = await provider.getSigner(userAddress)
  const signedContract = vaultContract.connect(signer)

  let estimatedGas = 0n

  if (canHarvest) {
    estimatedGas = await signedContract.updateStateAndDeposit.estimateGas(userAddress, referrer, params, overrides)
  }
  else {
    estimatedGas = await signedContract.deposit.estimateGas(userAddress, referrer, overrides)
  }

  return getGas({ estimatedGas, provider })
}


export default depositGas
