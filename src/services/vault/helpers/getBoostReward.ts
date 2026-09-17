import { constants } from '../../../helpers'

import getLeverageReward from './getLeverageReward'
import convertOsTokenSharesToAssets from './convertOsTokenSharesToAssets'

import type { PositionApyData } from './getPositionApyData'


type GetBoostRewardInput = PositionApyData & {
  isCollateralized: boolean
  isOsTokenEnabled: boolean
  boostedSharesDelta: bigint
}

const wad = constants.blockchain.amount1

const getBoostReward = (values: GetBoostRewardInput): bigint => {
  const {
    vaultApy,
    borrowApy,
    ltvPercent,
    osTokenRate,
    osTokenMintApy,
    isCollateralized,
    isOsTokenEnabled,
    boostedSharesDelta,
    leverageMaxMintLtvPercent,
    leverageMaxBorrowLtvPercent,
  } = values

  const vaultLeverageLtv = ltvPercent < leverageMaxMintLtvPercent ? ltvPercent : leverageMaxMintLtvPercent

  const isBoostAvailable = isCollateralized && isOsTokenEnabled && vaultLeverageLtv > 0n

  if (!isBoostAvailable || boostedSharesDelta <= 0n) {
    return 0n
  }

  const totalLtv = vaultLeverageLtv * leverageMaxBorrowLtvPercent / wad

  if (totalLtv >= wad) {
    return 0n
  }

  // a position that does not exist yet - the same three values are derived from the vault and aave ltv
  const mintedShares = boostedSharesDelta * wad / (wad - totalLtv) - boostedSharesDelta
  const mintedAssets = convertOsTokenSharesToAssets(mintedShares, osTokenRate)

  const depositedAssets = mintedAssets * wad / vaultLeverageLtv

  return getLeverageReward({
    vaultApy,
    borrowApy,
    mintedAssets,
    osTokenMintApy,
    depositedAssets,
    borrowedAssets: depositedAssets,
  })
}


export default getBoostReward
