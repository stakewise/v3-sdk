import type { Deposit } from './types'
import getHarvestParams from '../../requests/getHarvestParams'
import { commonLogic, referrer } from './common'

import encodeDeposit from './encodeDeposit'


const deposit: Deposit = async (values) => {
  const { options, provider, vaultAddress, userAddress } = values

  const { vaultContract, canHarvest, overrides } = await commonLogic(values)

  const signer = await provider.getSigner(userAddress)
  const signedContract = vaultContract.connect(signer)

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

deposit.encode = encodeDeposit


export default deposit
