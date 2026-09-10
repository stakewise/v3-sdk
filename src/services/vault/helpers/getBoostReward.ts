import graphql from '../../../graphql'

import getBoostDeltaReward from './getBoostDeltaReward'
import getBoostPositionAnnualReward from './getBoostPositionAnnualReward'

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
  boostedSharesDelta: bigint
}

const getBoostReward = async (values: GetBoostRewardInput): Promise<bigint> => {
  const {
    url,
    leverage,
    vaultApy,
    borrowApy,
    ltvPercent,
    vaultAddress,
    osTokenMintApy,
    isCollateralized,
    osTokenTotalAssets,
    osTokenTotalSupply,
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

    reward += getBoostPositionAnnualReward({
      vaultApy,
      borrowApy,
      osTokenMintApy,
      osTokenTotalAssets,
      osTokenTotalSupply,
      proxyExitingAssets,
      proxyAssets: BigInt(proxyData.allocators[0]?.assets || 0),
      proxyMintedShares: BigInt(proxyData.allocators[0]?.mintedOsTokenShares || 0),
      borrowedAssets: BigInt(proxyData.aavePositions[0]?.borrowedAssets || 0),
      proxyExitingMintedShares: BigInt(osTokenExitRequest?.osTokenShares || 0),
    })
  }

  if (isCollateralized) {
    reward += getBoostDeltaReward({
      vaultApy,
      borrowApy,
      ltvPercent,
      osTokenMintApy,
      osTokenTotalAssets,
      osTokenTotalSupply,
      boostedSharesDelta,
      leverageMaxMintLtvPercent,
      leverageMaxBorrowLtvPercent,
    })
  }

  return reward
}


export default getBoostReward
