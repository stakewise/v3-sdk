import graphql from '../../../../graphql'
import { BigDecimal, apiUrls, constants } from '../../../../helpers'
import { wrapAbortPromise } from '../../../../modules/gql-module'

import { validate } from './validate'


export type GetEstimatedApyInput = StakeWise.BaseInput & {
  stakedAssetsDelta?: bigint
  mintedSharesDelta?: bigint
  boostedSharesDelta?: bigint
}

const wad = constants.blockchain.amount1

const getAnnualReward = (principal: bigint, apy: number): bigint => {
  if (principal <= 0n || !apy) {
    return 0n
  }

  return BigInt(new BigDecimal(apy).divide(100).multiply(principal).decimals(0).toString())
}

const convertOsTokenSharesToAssets = (shares: bigint, totalAssets: bigint, totalSupply: bigint): bigint => (
  totalSupply === 0n ? shares : shares * totalAssets / totalSupply
)

const getVaultOsTokenMintApy = (osTokenApy: number, feePercent: number, ltvPercent: bigint): number => {
  if (ltvPercent === 0n) {
    return 0
  }

  return new BigDecimal(osTokenApy)
    .multiply(feePercent)
    .multiply(wad)
    .divide(10000 - feePercent)
    .divide(ltvPercent)
    .toNumber()
}

type BoostRewardInput = {
  vaultApy: number
  borrowApy: number
  feePercent: number
  osTokenApy: number
  ltvPercent: bigint
  proxyAssets: bigint
  borrowedAssets: bigint
  proxyMintedShares: bigint
  osTokenTotalAssets: bigint
  osTokenTotalSupply: bigint
}

const getBoostPositionAnnualReward = (values: BoostRewardInput): bigint => {
  const {
    vaultApy,
    borrowApy,
    feePercent,
    osTokenApy,
    ltvPercent,
    proxyAssets,
    borrowedAssets,
    proxyMintedShares,
    osTokenTotalAssets,
    osTokenTotalSupply,
  } = values

  const mintedOsTokenAssets = convertOsTokenSharesToAssets(proxyMintedShares, osTokenTotalAssets, osTokenTotalSupply)
  const osTokenMintApy = getVaultOsTokenMintApy(osTokenApy, feePercent, ltvPercent)

  let totalEarnedAssets = getAnnualReward(proxyAssets, vaultApy)
  totalEarnedAssets -= getAnnualReward(mintedOsTokenAssets, osTokenMintApy)
  totalEarnedAssets -= getAnnualReward(borrowedAssets, borrowApy)

  return totalEarnedAssets
}

const getEstimatedApy = async (values: GetEstimatedApyInput) => {
  const { options } = values

  const {
    userAddress,
    vaultAddress,
    stakedAssetsDelta,
    mintedSharesDelta,
    boostedSharesDelta,
  } = validate(values)

  const url = apiUrls.getSubgraphqlUrl(options)

  const data = await graphql.subgraph.vault.fetchEstimatedApyDataQuery({
    url,
    variables: {
      userAddress: userAddress.toLowerCase(),
      vaultAddress: vaultAddress.toLowerCase(),
    },
  })

  const vault = data.vaults[0]

  if (!vault) {
    return 0
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
    return totalAssets <= 0n ? 0 : vaultApy
  }

  // base APY from the vault
  let totalEarnedAssets = getAnnualReward(totalAssets, vaultApy)

  // minted osToken loses the mint APY
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

  // real boost reward from the leverage proxy (only for an existing position)
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
      feePercent,
      osTokenApy,
      ltvPercent,
      osTokenTotalAssets,
      osTokenTotalSupply,
      proxyAssets: BigInt(proxyData.allocators[0]?.assets || 0),
      proxyMintedShares: BigInt(proxyData.allocators[0]?.mintedOsTokenShares || 0),
      borrowedAssets: BigInt(proxyData.aavePositions[0]?.borrowedAssets || 0),
    })
  }

  // model a newly boosted amount with the subgraph leverage math (getAllocatorMaxBoostApy)
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
    return 0
  }

  const allocatorApy = new BigDecimal(totalEarnedAssets).divide(totalAssets).multiply(100).toNumber()

  if (vaultApy < allocatorMaxBoostApy && allocatorApy > allocatorMaxBoostApy) {
    return allocatorMaxBoostApy
  }

  return allocatorApy
}


export default wrapAbortPromise<GetEstimatedApyInput, number>(getEstimatedApy)
