import { DepositInput } from '../types'
import { commonLogic, referrer } from './common'
import getHarvestParams from '../../../requests/getHarvestParams'


type DepositDataOutput = StakeWise.TransactionData & {
  value: bigint
}

const depositEncode = async (values: DepositInput): Promise<DepositDataOutput> => {
  const { options, vaultAddress, userAddress } = values

  const { vaultContract, canHarvest, overrides } = await commonLogic(values)

  if (canHarvest) {
    const harvestParams = await getHarvestParams({ options, vaultAddress })

    const rx = await vaultContract.updateStateAndDeposit.populateTransaction(userAddress, referrer, harvestParams, overrides)

    return {
      ...rx,
      value: overrides.value,
    }
  }
  else {
    const rx = await vaultContract.deposit.populateTransaction(userAddress, referrer, overrides)

    return {
      ...rx,
      value: overrides.value,
    }
  }
}


export default depositEncode
