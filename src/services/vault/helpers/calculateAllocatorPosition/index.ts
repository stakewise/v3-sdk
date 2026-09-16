import { BigDecimal } from '../../../../helpers'

import getBoostReward from '../getBoostReward'
import getAnnualReward from '../getAnnualReward'
import validatePositionInput from '../validatePositionInput'
import convertOsTokenSharesToAssets from '../convertOsTokenSharesToAssets'

import capBoostApy from './capBoostApy'

import type { PositionInput } from '../validatePositionInput'
import type { Position } from '../../requests/getPositionData'


export type CalculateAllocatorPositionInput = PositionInput

const calculateAllocatorPosition = (values: CalculateAllocatorPositionInput): Position => {
  const { data, stakedAssetsDelta, mintedSharesDelta, boostedSharesDelta } = validatePositionInput(values)
  const { vault, boostedShares, leverageReward } = data

  if (!vault) {
    return { apy: 0, totalAssets: 0n }
  }

  const { apyData, isCollateralized, isOsTokenEnabled } = vault
  const { vaultApy, osTokenApy, osTokenRate, osTokenMintApy, allocatorMaxBoostApy } = apyData

  let totalAssets = data.stakedAssets + stakedAssetsDelta
  let mintedShares = data.mintedShares + mintedSharesDelta

  if (mintedShares < 0n) {
    mintedShares = 0n
  }

  if (!isOsTokenEnabled) {
    const stakedAssets = totalAssets > 0n ? totalAssets : 0n

    return { apy: stakedAssets === 0n ? 0 : vaultApy, totalAssets: stakedAssets }
  }

  let totalEarnedAssets = getAnnualReward(totalAssets, vaultApy)

  if (mintedShares > 0n) {
    const mintedAssets = convertOsTokenSharesToAssets(mintedShares, osTokenRate)

    totalEarnedAssets -= getAnnualReward(mintedAssets, osTokenMintApy)
  }

  const boostDelta = boostedSharesDelta > 0n ? boostedSharesDelta : 0n

  totalEarnedAssets += leverageReward
  totalEarnedAssets += getBoostReward({ ...apyData, isCollateralized, isOsTokenEnabled, boostedSharesDelta: boostDelta })

  const boostedOsTokenShares = boostedShares + boostDelta

  const hasExtraBoostShares = boostedOsTokenShares > mintedShares

  if (hasExtraBoostShares) {
    const extraShares = boostedOsTokenShares - mintedShares
    const extraAssets = convertOsTokenSharesToAssets(extraShares, osTokenRate)

    totalEarnedAssets += getAnnualReward(extraAssets, osTokenApy)
    totalAssets += extraAssets
  }

  if (totalAssets <= 0n) {
    return { apy: 0, totalAssets: 0n }
  }

  const allocatorApy = new BigDecimal(totalEarnedAssets).divide(totalAssets).multiply(100).toNumber()

  const apy = capBoostApy({ apy: allocatorApy, vaultApy, allocatorMaxBoostApy, hasExtraBoostShares })

  return { apy, totalAssets }
}


export default calculateAllocatorPosition
