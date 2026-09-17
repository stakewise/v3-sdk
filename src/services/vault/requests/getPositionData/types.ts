import type { PositionApyData } from '../../helpers/getPositionApyData'


export type PositionData = {
  vault: {
    apyData: PositionApyData
    isCollateralized: boolean
    isOsTokenEnabled: boolean
  } | null
  stakedAssets: bigint
  exitingAssets: bigint
  mintedShares: bigint
  walletShares: bigint
  boostedShares: bigint
  boostedAssets: bigint
  leverageReward: bigint
}

export type Position = {
  apy: number
  totalAssets: bigint
}
