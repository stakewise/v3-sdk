import { constants, validateArgs } from '../../../utils'


type GetMaxMintInput = {
  ltvPercent: bigint
  mintedAssets: bigint
  stakedAssets: bigint
  contracts: StakeWise.Contracts
}

const getMaxMint = async (values: GetMaxMintInput) => {
  const { contracts, ltvPercent, mintedAssets, stakedAssets } = values

  validateArgs.bigint({ ltvPercent, mintedAssets, stakedAssets })

  if (ltvPercent <= 0 || stakedAssets <= 0) {
    return 0n
  }

  const avgRewardPerSecond = await contracts.tokens.mintToken.avgRewardPerSecond()

  const maxMintedAssets = stakedAssets * ltvPercent / 10_000n
  const maxMintedAssetsHourReward = (maxMintedAssets * avgRewardPerSecond * 3600n) / constants.blockchain.amount1
  const canMintAssets = maxMintedAssets - maxMintedAssetsHourReward - mintedAssets

  if (canMintAssets > 0) {
    const maxMintShares2 = await contracts.tokens.mintToken.convertToShares(canMintAssets)

    return maxMintShares2
  }

  return 0n
}


export default getMaxMint
