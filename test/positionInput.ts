import { parseEther } from 'ethers'

import type { PositionApyData } from '../src/services/vault/helpers/getPositionApyData'
import type { Position, PositionData } from '../src/services/vault/requests/getPositionData'


export const apyData: PositionApyData = {
  vaultApy: 4,
  borrowApy: 3,
  osTokenApy: 2,
  feePercent: 500,
  ltvPercent: parseEther('0.9'),
  osTokenRate: parseEther('1.25'),
  osTokenMintApy: 1,
  allocatorMaxBoostApy: 10,
  leverageMaxMintLtvPercent: parseEther('0.99'),
  leverageMaxBorrowLtvPercent: parseEther('0.93'),
}

const zeroYieldApyData: PositionApyData = {
  ...apyData,
  vaultApy: 0,
  borrowApy: 0,
  osTokenApy: 0,
  osTokenMintApy: 0,
}

export const positionVault = {
  apyData,
  isCollateralized: true,
  isOsTokenEnabled: true,
}

export const positionData: PositionData = {
  vault: positionVault,
  stakedAssets: parseEther('10'),
  exitingAssets: parseEther('0.75'),
  mintedShares: parseEther('5'),
  walletShares: parseEther('2'),
  boostedShares: parseEther('4'),
  boostedAssets: parseEther('0.5'),
  leverageReward: parseEther('0.1'),
}

export const osTokenDisabledData: PositionData = {
  ...positionData,
  vault: { ...positionVault, isOsTokenEnabled: false },
}

export const zeroYieldData: PositionData = {
  ...positionData,
  vault: { ...positionVault, apyData: zeroYieldApyData },
  leverageReward: 0n,
}

export const emptyPosition: Position = { apy: 0, totalAssets: 0n }
