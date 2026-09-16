import { BigDecimal } from '../../../../helpers'

import getBoostReward from '../../helpers/getBoostReward'
import getAnnualReward from '../../helpers/getAnnualReward'
import validatePositionInput from '../../helpers/validatePositionInput'
import convertOsTokenSharesToAssets from '../../helpers/convertOsTokenSharesToAssets'

import type { Position } from '../getPositionData'
import type { PositionInput } from '../../helpers/validatePositionInput'


export type GetStakerPositionInput = PositionInput

const getSignedAnnualReward = (principal: bigint, apy: number): bigint => (
  principal >= 0n ? getAnnualReward(principal, apy) : -getAnnualReward(-principal, apy)
)

const getStakerPosition = (values: GetStakerPositionInput): Position => {
  const { data, stakedAssetsDelta, mintedSharesDelta, boostedSharesDelta } = validatePositionInput(values)
  const { vault, walletShares, boostedShares, boostedAssets, exitingAssets, leverageReward } = data

  if (!vault) {
    return { apy: 0, totalAssets: 0n }
  }

  const { apyData, isCollateralized, isOsTokenEnabled } = vault
  const { vaultApy, osTokenApy, osTokenRate, osTokenMintApy } = apyData

  const walletOsTokenDelta = mintedSharesDelta - boostedSharesDelta

  const stakedAssets = data.stakedAssets + stakedAssetsDelta

  let mintedOsTokenShares = data.mintedShares + mintedSharesDelta

  if (mintedOsTokenShares < 0n) {
    mintedOsTokenShares = 0n
  }

  const walletOsTokenShares = walletShares + walletOsTokenDelta
  const boostOsTokenShares = boostedShares + boostedSharesDelta

  // what the staker holds (wallet + boost) minus what they owe (minted against the stake)
  const ownOsTokenShares = walletOsTokenShares + boostOsTokenShares - mintedOsTokenShares
  const ownOsTokenAssets = convertOsTokenSharesToAssets(ownOsTokenShares, osTokenRate)

  const totalAssets = stakedAssets + exitingAssets + boostedAssets + ownOsTokenAssets

  if (totalAssets <= 0n) {
    return { apy: 0, totalAssets: 0n }
  }

  let totalEarnedAssets = getAnnualReward(stakedAssets, vaultApy)

  if (mintedOsTokenShares > 0n && isOsTokenEnabled) {
    const mintedOsTokenAssets = convertOsTokenSharesToAssets(mintedOsTokenShares, osTokenRate)

    totalEarnedAssets -= getAnnualReward(mintedOsTokenAssets, osTokenMintApy)
  }

  totalEarnedAssets += leverageReward
  totalEarnedAssets += getBoostReward({ ...apyData, isCollateralized, isOsTokenEnabled, boostedSharesDelta })
  totalEarnedAssets += getSignedAnnualReward(ownOsTokenAssets, osTokenApy)

  const apy = new BigDecimal(totalEarnedAssets).divide(totalAssets).multiply(100).toNumber()

  return { apy, totalAssets }
}


export default getStakerPosition
