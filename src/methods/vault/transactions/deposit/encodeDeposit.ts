import { DepositInput } from './types'
import { commonLogic, referrer } from './common'
import getHarvestParams from '../../requests/getHarvestParams'


type DepositDataOutput = Promise<StakeWise.TransactionData & {
  value: bigint
}>

const encodeDeposit = async (values: DepositInput): Promise<DepositDataOutput> => {
  const { options, vaultAddress, userAddress } = values

  const { vaultContract, canHarvest, overrides } = await commonLogic(values)

  if (canHarvest) {
    const harvestParams = await getHarvestParams({ options, vaultAddress })

    const rx = await vaultContract.updateStateAndDeposit.populateTransaction(userAddress, referrer, harvestParams, overrides)

    return {
      to: rx.to,
      data: rx.data,
      value: overrides.value,
    }
  }
  else {
    const rx = await vaultContract.deposit.populateTransaction(userAddress, referrer, overrides)

    return {
      to: rx.to,
      data: rx.data,
      value: overrides.value,
    }
  }
}


export default encodeDeposit
