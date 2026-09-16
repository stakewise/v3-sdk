import graphql from '../../../graphql'

import getLeverageReward from './getLeverageReward'
import convertOsTokenSharesToAssets from './convertOsTokenSharesToAssets'

import type { PositionApyData } from './getPositionApyData'
import type { PositionDataQueryPayload } from '../../../graphql/subgraph/vault'


type LeveragePosition = PositionDataQueryPayload['leverageStrategyPositions'][number]

type FetchLeverageRewardInput = PositionApyData & {
  url: string | ReadonlyArray<string>
  leverage?: LeveragePosition
  vaultAddress: string
}

const fetchLeverageReward = async (values: FetchLeverageRewardInput): Promise<bigint> => {
  const { url, leverage, vaultApy, borrowApy, osTokenRate, vaultAddress, osTokenMintApy } = values

  const boostedShares = BigInt(leverage?.osTokenShares || 0) + BigInt(leverage?.exitingOsTokenShares || 0)
  const boostedAssets = BigInt(leverage?.assets || 0) + BigInt(leverage?.exitingAssets || 0)

  const hasBoostedPosition = boostedShares > 0n || boostedAssets > 0n

  if (!leverage || !hasBoostedPosition) {
    return 0n
  }

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

  return getLeverageReward({
    vaultApy,
    borrowApy,
    osTokenMintApy,
    depositedAssets,
    borrowedAssets: BigInt(proxyData.aavePositions[0]?.borrowedAssets || 0),
    mintedAssets: convertOsTokenSharesToAssets(mintedShares, osTokenRate),
  })
}


export default fetchLeverageReward
