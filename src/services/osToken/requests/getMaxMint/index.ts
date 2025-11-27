import { constants, validateArgs } from '../../../../helpers'
import { wrapAbortPromise } from '../../../../modules/gql-module'


export type GetMaxMintInput = StakeWise.CommonParams & {
  ltvPercent: bigint
  mintedAssets: bigint
  stakedAssets: bigint
  vaultAddress: string
}

const getMaxMint = async (values: GetMaxMintInput) => {
  const { contracts, ltvPercent, mintedAssets, stakedAssets, vaultAddress } = values

  validateArgs.address({ vaultAddress })
  validateArgs.bigint({ ltvPercent, mintedAssets, stakedAssets })

  if (ltvPercent <= 0 || stakedAssets <= 0) {
    return 0n
  }

  const avgRewardPerSecond = await contracts.base.mintTokenController.avgRewardPerSecond()

  const maxMintedAssets = stakedAssets * ltvPercent / constants.blockchain.amount1
  const maxMintedAssetsHourReward = (maxMintedAssets * avgRewardPerSecond * 3600n) / constants.blockchain.amount1
  const canMintAssets = maxMintedAssets - maxMintedAssetsHourReward - mintedAssets

  if (canMintAssets > 0) {
    const maxMintShares = await contracts.base.mintTokenController.convertToShares(canMintAssets)

    // solves the problem of incorrect rounding
    return maxMintShares - 1n
  }

  return 0n
}


export default wrapAbortPromise<GetMaxMintInput, bigint>(getMaxMint)
