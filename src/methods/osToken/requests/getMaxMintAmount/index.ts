import getBalance from '../getBalance'
import { constants, validateArgs } from '../../../../utils'
import { wrapAbortPromise } from '../../../../modules/gql-module'
import getStakeBalance from '../../../vault/requests/getStakeBalance'
import getOsTokenConfig from '../../../vault/requests/getOsTokenConfig'


type GetMaxMintAmountInput = {
  userAddress: string
  vaultAddress: string
  options: StakeWise.Options
  contracts: StakeWise.Contracts
}

const getMaxMintAmount = async (values: GetMaxMintAmountInput) => {
  const { contracts, options, vaultAddress, userAddress } = values

  validateArgs.address({ vaultAddress, userAddress })

  const [ config, mint, stake ] = await Promise.all([
    getOsTokenConfig({ vaultAddress, options }),
    getBalance({ options, contracts, vaultAddress, userAddress }),
    getStakeBalance({ options, contracts, vaultAddress, userAddress }),
  ])

  const ltvPercent = BigInt(config.ltvPercent)
  const stakedAssets = stake.assets
  const mintedAssets = mint.assets

  if (ltvPercent <= 0 || stakedAssets <= 0) {
    return 0n
  }

  const avgRewardPerSecond = await contracts.base.mintTokenController.avgRewardPerSecond()

  const maxMintedAssets = stakedAssets * ltvPercent / constants.blockchain.amount1
  const maxMintedAssetsHourReward = (maxMintedAssets * avgRewardPerSecond * 3600n) / constants.blockchain.amount1
  const canMintAssets = maxMintedAssets - maxMintedAssetsHourReward - mintedAssets

  if (canMintAssets > 0) {
    const maxMintShares = await contracts.base.mintTokenController.convertToShares(canMintAssets)

    return maxMintShares
  }

  return 0n
}


export default wrapAbortPromise<GetMaxMintAmountInput, bigint>(getMaxMintAmount)
