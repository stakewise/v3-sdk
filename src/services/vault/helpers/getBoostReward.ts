import graphql from '../../../graphql'
import { constants } from '../../../helpers'

import getLeverageReward from './getLeverageReward'
import convertOsTokenSharesToAssets from './convertOsTokenSharesToAssets'

import type { PositionApyData } from './getPositionApyData'


type ExitRequest = {
  id: string
  totalAssets: string
  exitedAssets: string
}

type LeveragePosition = {
  proxy: string
  assets: string
  exitingAssets: string
  osTokenShares: string
  exitingOsTokenShares: string
  exitRequest?: ExitRequest | null
}

type GetBoostRewardInput = PositionApyData & {
  url: string | ReadonlyArray<string>
  leverage?: LeveragePosition | null
  vaultAddress: string
  isCollateralized: boolean
  isOsTokenEnabled: boolean
  boostedSharesDelta: bigint
}

const wad = constants.blockchain.amount1

const getBoostReward = async (values: GetBoostRewardInput): Promise<bigint> => {
  const {
    url,
    leverage,
    vaultApy,
    borrowApy,
    ltvPercent,
    vaultAddress,
    osTokenRate,
    osTokenMintApy,
    isCollateralized,
    isOsTokenEnabled,
    boostedSharesDelta,
    leverageMaxMintLtvPercent,
    leverageMaxBorrowLtvPercent,
  } = values

  const boostedShares = leverage
    ? BigInt(leverage.osTokenShares || 0) + BigInt(leverage.exitingOsTokenShares || 0)
    : 0n

  const boostedAssets = leverage
    ? BigInt(leverage.assets || 0) + BigInt(leverage.exitingAssets || 0)
    : 0n

  let reward = 0n

  if (leverage && (boostedShares > 0n || boostedAssets > 0n)) {
    const exitRequest = leverage.exitRequest

    const proxyData = await graphql.subgraph.vault.fetchBoostProxyApyDataQuery({
      url,
      variables: {
        vaultAddress: vaultAddress.toLowerCase(),
        proxyAddress: (leverage.proxy || '').toLowerCase(),
        exitRequestId: exitRequest?.id || '',
      },
    })

    const osTokenExitRequest = proxyData.osTokenExitRequests[0]
    const isExitPending = osTokenExitRequest?.exitedAssets === null

    const proxyExitingAssets = isExitPending
      ? BigInt(exitRequest?.totalAssets || 0) - BigInt(exitRequest?.exitedAssets || 0)
      : 0n

    const depositedAssets = BigInt(proxyData.allocators[0]?.assets || 0) + proxyExitingAssets
    const mintedShares = BigInt(proxyData.allocators[0]?.mintedOsTokenShares || 0)
      + BigInt(osTokenExitRequest?.osTokenShares || 0)

    reward += getLeverageReward({
      vaultApy,
      borrowApy,
      osTokenMintApy,
      depositedAssets,
      borrowedAssets: BigInt(proxyData.aavePositions[0]?.borrowedAssets || 0),
      mintedAssets: convertOsTokenSharesToAssets(mintedShares, osTokenRate),
    })
  }

  const vaultLeverageLtv = ltvPercent < leverageMaxMintLtvPercent ? ltvPercent : leverageMaxMintLtvPercent

  const isBoostAvailable = isCollateralized && isOsTokenEnabled && vaultLeverageLtv > 0n

  if (!isBoostAvailable || boostedSharesDelta <= 0n) {
    return reward
  }

  const totalLtv = vaultLeverageLtv * leverageMaxBorrowLtvPercent / wad

  if (totalLtv >= wad) {
    return reward
  }

  // a position that does not exist yet - the same three values are derived from the vault and aave ltv
  const mintedShares = boostedSharesDelta * wad / (wad - totalLtv) - boostedSharesDelta
  const mintedAssets = convertOsTokenSharesToAssets(mintedShares, osTokenRate)

  const depositedAssets = mintedAssets * wad / vaultLeverageLtv

  reward += getLeverageReward({
    vaultApy,
    borrowApy,
    mintedAssets,
    osTokenMintApy,
    depositedAssets,
    borrowedAssets: depositedAssets,
  })

  return reward
}


export default getBoostReward
