import getMaxWithdraw from './getMaxWithdraw'
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

  const availableAssets = await getAvailableAssets({ options, contracts, vaultAddress, userAddress })
  const maxWithdrawAssets = await getMaxWithdraw({ contracts, ltvPercent, mintedAssets, stakedAssets })

  return {
    availableAssets,
    maxWithdrawAssets,
  }
}


export default getWithdrawData
