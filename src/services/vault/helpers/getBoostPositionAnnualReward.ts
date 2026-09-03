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
  proxyExitingAssets: bigint
  proxyExitingMintedShares: bigint
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
    proxyExitingAssets,
    proxyExitingMintedShares,
  } = values

  const effectiveAssets = proxyAssets + proxyExitingAssets
  const effectiveMintedShares = proxyMintedShares + proxyExitingMintedShares

  const mintedOsTokenAssets = convertOsTokenSharesToAssets(effectiveMintedShares, osTokenTotalAssets, osTokenTotalSupply)

  let totalEarnedAssets = getAnnualReward(effectiveAssets, vaultApy)
  totalEarnedAssets -= getAnnualReward(mintedOsTokenAssets, osTokenMintApy)
  totalEarnedAssets -= getAnnualReward(borrowedAssets, borrowApy)

  return totalEarnedAssets
}


export default getBoostPositionAnnualReward
