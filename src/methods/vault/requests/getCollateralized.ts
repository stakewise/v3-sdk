import { validateArgs } from '../../../utils'


type GetHarvestParamsInput = {
  vaultAddress: string
  contracts: StakeWise.Contracts
}

const getCollateralized = async (values: GetHarvestParamsInput) => {
  const { contracts, vaultAddress } = values

  validateArgs.address({ vaultAddress })

  const isVaultCollateralized = await contracts.base.keeper.isCollateralized(vaultAddress)

  return isVaultCollateralized
}


export default getCollateralized
