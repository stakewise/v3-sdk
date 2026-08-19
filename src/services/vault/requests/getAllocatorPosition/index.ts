import graphql from '../../../../graphql'
import { BigDecimal, apiUrls, constants } from '../../../../helpers'
import { wrapAbortPromise } from '../../../../modules/gql-module'

import getAnnualReward from '../../helpers/getAnnualReward'
import getVaultOsTokenMintApy from '../../helpers/getVaultOsTokenMintApy'
import convertOsTokenSharesToAssets from '../../helpers/convertOsTokenSharesToAssets'
import getBoostPositionAnnualReward from '../../helpers/getBoostPositionAnnualReward'

import { validate } from './validate'


export type GetAllocatorPositionInput = StakeWise.BaseInput & {
  stakedAssetsDelta?: bigint
  mintedSharesDelta?: bigint
  boostedSharesDelta?: bigint
}

type Output = {
  apy: number
  totalStakedAssets: bigint
}

const wad = constants.blockchain.amount1

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
    return { apy: 0, totalStakedAssets: 0n }
  }

  const allocator = data.allocators[0]
  const leverage = data.leverageStrategyPositions[0]

  const vaultApy = Number(vault.apy)
  const allocatorMaxBoostApy = Number(vault.allocatorMaxBoostApy)
  const ltvPercent = BigInt(vault.osTokenConfig?.ltvPercent || 0)
  const leverageMaxMintLtvPercent = BigInt(vault.osTokenConfig?.leverageMaxMintLtvPercent || 0)

  const osTokenApy = Number(data.osToken?.apy || 0)
  const feePercent = Number(data.osToken?.feePercent || 0)
  const osTokenTotalAssets = BigInt(data.osToken?.totalAssets || 0)
  const osTokenTotalSupply = BigInt(data.osToken?.totalSupply || 0)
  const borrowApy = Number(data.aave?.borrowApy || 0)
  const leverageMaxBorrowLtvPercent = BigInt(data.aave?.leverageMaxBorrowLtvPercent || 0)

  const osTokenMintApy = getVaultOsTokenMintApy(osTokenApy, feePercent, ltvPercent)

  let totalAssets = BigInt(allocator?.assets || 0) + stakedAssetsDelta
  let mintedShares = BigInt(allocator?.mintedOsTokenShares || 0) + mintedSharesDelta

  if (mintedShares < 0n) {
    mintedShares = 0n
  }

  if (!vault.isOsTokenEnabled) {
    const stakedAssets = totalAssets > 0n ? totalAssets : 0n

    return { apy: stakedAssets === 0n ? 0 : vaultApy, totalStakedAssets: stakedAssets }
  }

  let totalEarnedAssets = getAnnualReward(totalAssets, vaultApy)

  if (mintedShares > 0n) {
    const mintedAssets = convertOsTokenSharesToAssets(mintedShares, osTokenTotalAssets, osTokenTotalSupply)

    totalEarnedAssets -= getAnnualReward(mintedAssets, osTokenMintApy)
  }

  const existingBoostedShares = leverage
    ? BigInt(leverage.osTokenShares || 0) + BigInt(leverage.exitingOsTokenShares || 0)
    : 0n

  const hasBoostPosition = existingBoostedShares > 0n
    || BigInt(leverage?.assets || 0) > 0n
    || BigInt(leverage?.exitingAssets || 0) > 0n

  if (hasBoostPosition) {
    const proxyData = await graphql.subgraph.vault.fetchBoostProxyApyDataQuery({
      url,
      variables: {
        vaultAddress: vaultAddress.toLowerCase(),
        proxyAddress: (leverage.proxy || '').toLowerCase(),
      },
    })

    totalEarnedAssets += getBoostPositionAnnualReward({
      vaultApy,
      borrowApy,
      osTokenMintApy,
      osTokenTotalAssets,
      osTokenTotalSupply,
      proxyAssets: BigInt(proxyData.allocators[0]?.assets || 0),
      proxyMintedShares: BigInt(proxyData.allocators[0]?.mintedOsTokenShares || 0),
      borrowedAssets: BigInt(proxyData.aavePositions[0]?.borrowedAssets || 0),
    })
  }

  let strategyMintedShares = 0n

  if (boostedSharesDelta > 0n && vault.isCollateralized) {
    const vaultLeverageLtv = ltvPercent < leverageMaxMintLtvPercent ? ltvPercent : leverageMaxMintLtvPercent
    const aaveLeverageLtv = leverageMaxBorrowLtvPercent
    const totalLtv = vaultLeverageLtv * aaveLeverageLtv / wad

    if (vaultLeverageLtv > 0n && aaveLeverageLtv > 0n && wad > totalLtv) {
      strategyMintedShares = boostedSharesDelta * wad / (wad - totalLtv) - boostedSharesDelta

      const strategyMintedAssets = convertOsTokenSharesToAssets(strategyMintedShares, osTokenTotalAssets, osTokenTotalSupply)
      const strategyDepositedAssets = strategyMintedAssets * wad / vaultLeverageLtv

      totalEarnedAssets += getAnnualReward(strategyDepositedAssets, vaultApy)
      totalEarnedAssets -= getAnnualReward(strategyMintedAssets, osTokenMintApy)
      totalEarnedAssets -= getAnnualReward(strategyDepositedAssets, borrowApy)
    }
  }

  const boostedOsTokenShares = existingBoostedShares + boostedSharesDelta + strategyMintedShares

  if (boostedOsTokenShares > mintedShares) {
    const extraShares = boostedOsTokenShares - mintedShares
    const extraAssets = convertOsTokenSharesToAssets(extraShares, osTokenTotalAssets, osTokenTotalSupply)

    totalEarnedAssets += getAnnualReward(extraAssets, osTokenApy)
    totalAssets += extraAssets
  }

  if (totalAssets <= 0n) {
    return { apy: 0, totalStakedAssets: 0n }
  }

  const allocatorApy = new BigDecimal(totalEarnedAssets).divide(totalAssets).multiply(100).toNumber()

  const apy = vaultApy < allocatorMaxBoostApy && allocatorApy > allocatorMaxBoostApy
    ? allocatorMaxBoostApy
    : allocatorApy

  return { apy, totalStakedAssets: totalAssets }
}


export default wrapAbortPromise<GetAllocatorPositionInput, Output>(getAllocatorPosition)
