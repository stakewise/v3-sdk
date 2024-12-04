import { DepositInput } from '../types'
import { commonLogic } from './common'


type DepositDataOutput = StakeWise.TransactionData & {
  value: bigint
}

const depositEncode = async (values: DepositInput): Promise<DepositDataOutput> => {
  const { assets } = values

  const { vaultContract, params, canHarvest } = await commonLogic(values)

  if (canHarvest) {
    const rx = await vaultContract.updateStateAndDeposit.populateTransaction(...params)

    return {
      ...rx,
      value: assets,
    }
  }
  else {
    const rx = await vaultContract.deposit.populateTransaction(...params)

    return {
      ...rx,
      value: assets,
    }
  }
}


export default depositEncode
