import { DepositInput } from '../types'
import { commonLogic, referrer } from './common'
import getHarvestParams from '../../../requests/getHarvestParams'


type DepositDataOutput = StakeWise.TransactionData & {
  value: bigint
}

const depositEncode = async (values: DepositInput): Promise<DepositDataOutput> => {
  const { options, vaultAddress, userAddress } = values

  const { vaultContract, overrides } = await commonLogic(values)
  const { params, canHarvest } = await getHarvestParams({ options, vaultAddress })

  if (canHarvest) {
    const rx = await vaultContract.updateStateAndDeposit.populateTransaction(userAddress, referrer, params, overrides)

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
