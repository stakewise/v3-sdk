import { getGas } from '../../../../../utils'
import type { DepositInput } from '../types'
import { commonLogic, referrer } from './common'
import getHarvestParams from '../../../requests/getHarvestParams'


const depositGas = async (values: DepositInput) => {
  const { options, provider, vaultAddress, userAddress } = values

  const { vaultContract, canHarvest, overrides } = await commonLogic(values)

  const signer = await provider.getSigner(userAddress)
  const signedContract = vaultContract.connect(signer)

  let estimatedGas = 0n

  if (canHarvest) {
    const harvestParams = await getHarvestParams({ options, vaultAddress })

    estimatedGas = await signedContract.updateStateAndDeposit.estimateGas(userAddress, referrer, harvestParams, overrides)
  }
  else {
    estimatedGas = await signedContract.deposit.estimateGas(userAddress, referrer, overrides)
  }

  const gas = await getGas({ estimatedGas, provider })

  return gas
}


export default depositGas
