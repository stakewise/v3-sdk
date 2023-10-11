import getMaxWithdraw from './getMaxWithdraw'
import { validateArgs } from '../../../../utils'
import getAvailableAssets from './getAvailableAssets'


type GetWithdrawDataInput = {
  ltvPercent: bigint
  userAddress: string
  vaultAddress: string
  mintedAssets: bigint
  stakedAssets: bigint
  options: StakeWise.Options
  contracts: StakeWise.Contracts
}

const getWithdrawData = async (values: GetWithdrawDataInput) => {
  const { options, contracts, ltvPercent, mintedAssets, stakedAssets, vaultAddress, userAddress } = values

  validateArgs.address({ vaultAddress, userAddress })
  validateArgs.bigint({ ltvPercent, mintedAssets, stakedAssets })

  const availableAssets = await getAvailableAssets({ options, contracts, vaultAddress, userAddress })
  const maxWithdrawAssets = await getMaxWithdraw({ contracts, ltvPercent, mintedAssets, stakedAssets })

  return {
    availableAssets,
    maxWithdrawAssets,
  }
}


export default getWithdrawData
