import graphql from '../../../../graphql'
import { apiUrls, constants } from '../../../../helpers'
import { wrapAbortPromise } from '../../../../modules/gql-module'

import getPositionApyData from '../../helpers/getPositionApyData'
import fetchLeverageReward from '../../helpers/fetchLeverageReward'

import { validate } from './validate'
import type { PositionData } from './types'


export type { Position, PositionData } from './types'

export type GetPositionDataInput = StakeWise.BaseInput

const getPositionData = async (values: GetPositionDataInput): Promise<PositionData> => {
  const { options, contracts } = values
  const { userAddress, vaultAddress } = validate(values)

  const url = apiUrls.getSubgraphqlUrl(options)

  const [ data, osTokenRate ] = await Promise.all([
    graphql.subgraph.vault.fetchPositionDataQuery({
      url,
      variables: {
        userId: userAddress.toLowerCase(),
        userAddress: userAddress.toLowerCase(),
        vaultAddress: vaultAddress.toLowerCase(),
      },
    }),
    contracts.base.mintTokenController.convertToAssets(constants.blockchain.amount1),
  ])

  const vault = data.vaults[0]
  const allocator = data.allocators[0]
  const leverage = data.leverageStrategyPositions[0]

  const boostedShares = BigInt(leverage?.osTokenShares || 0) + BigInt(leverage?.exitingOsTokenShares || 0)
  const boostedAssets = BigInt(leverage?.assets || 0) + BigInt(leverage?.exitingAssets || 0)

  const hasBoostedPosition = boostedShares > 0n || boostedAssets > 0n

  const position = {
    stakedAssets: BigInt(allocator?.assets || 0),
    exitingAssets: BigInt(allocator?.exitingAssets || 0),
    mintedShares: BigInt(allocator?.mintedOsTokenShares || 0),
    walletShares: BigInt(data.osTokenHolder?.balance || 0),
    boostedShares,
    boostedAssets,
  }

  if (!vault) {
    return { ...position, vault: null, leverageReward: 0n }
  }

  const apyData = getPositionApyData({
    vault,
    osTokenRate,
    aave: data.aave,
    osToken: data.osToken,
  })

  const leverageReward = leverage && hasBoostedPosition
    ? await fetchLeverageReward({ ...apyData, url, leverage, vaultAddress })
    : 0n

  return {
    ...position,
    vault: {
      apyData,
      isCollateralized: vault.isCollateralized,
      isOsTokenEnabled: vault.isOsTokenEnabled,
    },
    leverageReward,
  }
}


export default wrapAbortPromise<GetPositionDataInput, PositionData>(getPositionData)
