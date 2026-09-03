import { constants } from '../../../helpers'

import getAnnualReward from './getAnnualReward'
import convertOsTokenSharesToAssets from './convertOsTokenSharesToAssets'


type GetBoostDeltaRewardInput = {
  vaultApy: number
  borrowApy: number
  ltvPercent: bigint
  osTokenMintApy: number
  osTokenTotalAssets: bigint
  osTokenTotalSupply: bigint
  boostedSharesDelta: bigint
  leverageMaxMintLtvPercent: bigint
  leverageMaxBorrowLtvPercent: bigint
}

const wad = constants.blockchain.amount1

const getBoostDeltaReward = (values: GetBoostDeltaRewardInput): bigint => {
  const {
    vaultApy,
    borrowApy,
    ltvPercent,
    osTokenMintApy,
    osTokenTotalAssets,
    osTokenTotalSupply,
    boostedSharesDelta,
    leverageMaxMintLtvPercent,
    leverageMaxBorrowLtvPercent,
  } = values

  if (boostedSharesDelta <= 0n) {
    return 0n
  }

  const vaultLeverageLtv = ltvPercent < leverageMaxMintLtvPercent ? ltvPercent : leverageMaxMintLtvPercent
  const aaveLeverageLtv = leverageMaxBorrowLtvPercent

  if (vaultLeverageLtv <= 0n || aaveLeverageLtv <= 0n) {
    return 0n
  }

  const totalLtv = vaultLeverageLtv * aaveLeverageLtv / wad

  if (totalLtv >= wad) {
    return 0n
  }

  const strategyMintedShares = boostedSharesDelta * wad / (wad - totalLtv) - boostedSharesDelta
  const strategyMintedAssets = convertOsTokenSharesToAssets(strategyMintedShares, osTokenTotalAssets, osTokenTotalSupply)
  const strategyDepositedAssets = strategyMintedAssets * wad / vaultLeverageLtv

  let annualReward = getAnnualReward(strategyDepositedAssets, vaultApy)
  annualReward -= getAnnualReward(strategyMintedAssets, osTokenMintApy)
  annualReward -= getAnnualReward(strategyDepositedAssets, borrowApy)

  return annualReward
}


export default getBoostDeltaReward
