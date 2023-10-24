import { ZeroAddress } from 'ethers'

import { validateArgs } from '../../../utils'
import getHarvestParams from '../requests/getHarvestParams'


type DepositDataInput = {
  assets: bigint
  userAddress: string
  vaultAddress: string
  options: StakeWise.Options
  contracts: StakeWise.Contracts
}

type DepositDataOutput = Promise<StakeWise.TransactionData & {
  value: bigint
}>

const referrer = ZeroAddress

const depositData = async (values: DepositDataInput): Promise<DepositDataOutput> => {
  const { options, contracts, assets, vaultAddress, userAddress } = values

  validateArgs.bigint({ assets })
  validateArgs.address({ vaultAddress, userAddress })

  const vaultContract = contracts.helpers.createVaultContract(vaultAddress)
  const canHarvest = await contracts.base.keeper.canHarvest(vaultAddress)

  const overrides = {
    value: assets,
  }

  if (canHarvest) {
    const harvestParams = await getHarvestParams({ options, vaultAddress })

    const rx = await vaultContract.updateStateAndDeposit.populateTransaction(userAddress, referrer, harvestParams, overrides)

    return {
      to: rx.to,
      data: rx.data,
      value: assets,
    }
  }
  else {
    const rx = await vaultContract.deposit.populateTransaction(userAddress, referrer, overrides)

    return {
      to: rx.to,
      data: rx.data,
      value: assets,
    }
  }
}


export default depositData
