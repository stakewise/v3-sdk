import getAnnualReward from './getAnnualReward'
import convertOsTokenSharesToAssets from './convertOsTokenSharesToAssets'


type GetBoostPositionAnnualRewardInput = {
  vaultApy: number
  borrowApy: number
  osTokenMintApy: number
  proxyAssets: bigint
  borrowedAssets: bigint
  proxyMintedShares: bigint
  osTokenTotalAssets: bigint
  osTokenTotalSupply: bigint
}

const getBoostPositionAnnualReward = (values: GetBoostPositionAnnualRewardInput): bigint => {
  const {
    vaultApy,
    borrowApy,
    osTokenMintApy,
    proxyAssets,
    borrowedAssets,
    proxyMintedShares,
    osTokenTotalAssets,
    osTokenTotalSupply,
  } = values

  const mintedOsTokenAssets = convertOsTokenSharesToAssets(proxyMintedShares, osTokenTotalAssets, osTokenTotalSupply)

  let totalEarnedAssets = getAnnualReward(proxyAssets, vaultApy)
  totalEarnedAssets -= getAnnualReward(mintedOsTokenAssets, osTokenMintApy)
  totalEarnedAssets -= getAnnualReward(borrowedAssets, borrowApy)

  return totalEarnedAssets
}


export default getBoostPositionAnnualReward
