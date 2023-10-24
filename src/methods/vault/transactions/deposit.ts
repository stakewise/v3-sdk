import { ZeroAddress } from 'ethers'

import { validateArgs } from '../../../utils'
import getHarvestParams from '../requests/getHarvestParams'


type DepositInput = {
  assets: bigint
  userAddress: string
  vaultAddress: string
  options: StakeWise.Options
  provider: StakeWise.Provider
  contracts: StakeWise.Contracts
}

const referrer = ZeroAddress

const deposit = async (values: DepositInput): Promise<StakeWise.TransactionHash> => {
  const { options, contracts, provider, assets, vaultAddress, userAddress } = values

  validateArgs.bigint({ assets })
  validateArgs.address({ vaultAddress, userAddress })

  const signer = await provider.getSigner(userAddress)
  const vaultContract = contracts.helpers.createVaultContract(vaultAddress)
  const signedContract = vaultContract.connect(signer)
  const canHarvest = await contracts.base.keeper.canHarvest(vaultAddress)

  const overrides = {
    value: assets,
  }

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


export default deposit
