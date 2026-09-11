import graphql from '../../../../graphql'
import { BigDecimal, apiUrls } from '../../../../helpers'
import { wrapAbortPromise } from '../../../../modules/gql-module'

import getBoostReward from '../../helpers/getBoostReward'
import getAnnualReward from '../../helpers/getAnnualReward'
import getPositionApyData from '../../helpers/getPositionApyData'
import convertOsTokenSharesToAssets from '../../helpers/convertOsTokenSharesToAssets'

import { validate } from './validate'
import capBoostApy from './capBoostApy'


export type GetAllocatorPositionInput = StakeWise.BaseInput & {
  stakedAssetsDelta?: bigint
  mintedSharesDelta?: bigint
  boostedSharesDelta?: bigint
}

type Output = {
  apy: number
  totalAssets: bigint
}

const getAllocatorPosition = async (values: GetAllocatorPositionInput) => {
  const { options } = values

  const {
    userAddress,
    vaultAddress,
    stakedAssetsDelta,
    mintedSharesDelta,
    boostedSharesDelta,
  } = validate(values)

  const url = apiUrls.getSubgraphqlUrl(options)

  const data = await graphql.subgraph.vault.fetchAllocatorPositionDataQuery({
    url,
    variables: {
      userAddress: userAddress.toLowerCase(),
      vaultAddress: vaultAddress.toLowerCase(),
    },
  })

  const vault = data.vaults[0]

  if (!vault) {
    return { apy: 0, totalAssets: 0n }
  }

  const allocator = data.allocators[0]
  const leverage = data.leverageStrategyPositions[0]

  const apyData = getPositionApyData({ vault, aave: data.aave, osToken: data.osToken })

  const { vaultApy, osTokenApy, osTokenMintApy, osTokenTotalAssets, osTokenTotalSupply, allocatorMaxBoostApy } = apyData

  let totalAssets = BigInt(allocator?.assets || 0) + stakedAssetsDelta
  let mintedShares = BigInt(allocator?.mintedOsTokenShares || 0) + mintedSharesDelta

  if (mintedShares < 0n) {
    mintedShares = 0n
  }

  if (!vault.isOsTokenEnabled) {
    const stakedAssets = totalAssets > 0n ? totalAssets : 0n

    return { apy: stakedAssets === 0n ? 0 : vaultApy, totalAssets: stakedAssets }
  }

  let totalEarnedAssets = getAnnualReward(totalAssets, vaultApy)

  if (mintedShares > 0n) {
    const mintedAssets = convertOsTokenSharesToAssets(mintedShares, osTokenTotalAssets, osTokenTotalSupply)

    totalEarnedAssets -= getAnnualReward(mintedAssets, osTokenMintApy)
  }

  totalEarnedAssets += await getBoostReward({
    ...apyData,
    url,
    leverage,
    vaultAddress,
    boostedSharesDelta,
    isCollateralized: vault.isCollateralized,
    isOsTokenEnabled: vault.isOsTokenEnabled,
  })

  const existingBoostedShares = leverage
    ? BigInt(leverage.osTokenShares || 0) + BigInt(leverage.exitingOsTokenShares || 0)
    : 0n

  const boostedOsTokenShares = existingBoostedShares + boostedSharesDelta

  const hasExtraBoostShares = boostedOsTokenShares > mintedShares

  if (hasExtraBoostShares) {
    const extraShares = boostedOsTokenShares - mintedShares
    const extraAssets = convertOsTokenSharesToAssets(extraShares, osTokenTotalAssets, osTokenTotalSupply)

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


export default wrapAbortPromise<GetAllocatorPositionInput, Output>(getAllocatorPosition)
