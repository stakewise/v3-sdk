import { BigDecimal } from 'helpers'


type GetMaxMintSharesInput = {
  ltvPercent: bigint
  stakedAssets: bigint
  mintedShares: bigint
  contracts: StakeWise.Contracts
}

const getMaxMintShares = async (values: GetMaxMintSharesInput) => {
  const { contracts, stakedAssets, mintedShares, ltvPercent } = values

  if (ltvPercent <= 0 || stakedAssets <= 0) {
    return 0n
  }

  const rewardPerSecond = await contracts.tokens.mintToken.avgRewardPerSecond()

  const avgRewardPerHour = rewardPerSecond * 60n * 60n

  const result = new BigDecimal(stakedAssets)
    .multiply(ltvPercent)
    .divide(10_000)
    .minus(avgRewardPerHour)
    .decimals(0)
    .toString()

  let maxMintShares = await contracts.tokens.mintToken.convertToShares(result)

  if (maxMintShares > mintedShares) {
    maxMintShares = maxMintShares - mintedShares

    return maxMintShares
  }

  return 0n
}


export default getMaxMintShares
