import graphql from '../../../../graphql'
import { BigDecimal, apiUrls } from '../../../../helpers'
import { wrapAbortPromise } from '../../../../modules/gql-module'

import capBoostApy from '../../helpers/capBoostApy'
import getBoostReward from '../../helpers/getBoostReward'
import getAnnualReward from '../../helpers/getAnnualReward'
import getPositionApyData from '../../helpers/getPositionApyData'
import convertOsTokenSharesToAssets from '../../helpers/convertOsTokenSharesToAssets'

import { validate } from './validate'


export type GetStakerPositionInput = StakeWise.BaseInput & {
  stakedAssetsDelta?: bigint
  mintedSharesDelta?: bigint
  boostedSharesDelta?: bigint
}

type Output = {
  apy: number
  totalAssets: bigint
}

const getSignedAnnualReward = (principal: bigint, apy: number): bigint => (
  principal >= 0n ? getAnnualReward(principal, apy) : -getAnnualReward(-principal, apy)
)

const convertSigned = (shares: bigint, totalAssets: bigint, totalSupply: bigint): bigint => (
  shares >= 0n
    ? convertOsTokenSharesToAssets(shares, totalAssets, totalSupply)
    : -convertOsTokenSharesToAssets(-shares, totalAssets, totalSupply)
)

const getStakerPosition = async (values: GetStakerPositionInput) => {
  const { options } = values

  const {
    userAddress,
    vaultAddress,
    stakedAssetsDelta,
    mintedSharesDelta,
    boostedSharesDelta,
  } = validate(values)

  const url = apiUrls.getSubgraphqlUrl(options)

  const data = await graphql.subgraph.vault.fetchStakerPositionDataQuery({
    url,
    variables: {
      userId: userAddress.toLowerCase(),
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

  const walletOsTokenDelta = mintedSharesDelta - boostedSharesDelta

  const stakedAssets = BigInt(allocator?.assets || 0) + stakedAssetsDelta
  const exitingAssets = BigInt(allocator?.exitingAssets || 0)

  let mintedOsTokenShares = BigInt(allocator?.mintedOsTokenShares || 0) + mintedSharesDelta

  if (mintedOsTokenShares < 0n) {
    mintedOsTokenShares = 0n
  }

  const walletOsTokenShares = BigInt(data.osTokenHolder?.balance || 0) + walletOsTokenDelta

  const existingBoostedShares = leverage
    ? BigInt(leverage.osTokenShares || 0) + BigInt(leverage.exitingOsTokenShares || 0)
    : 0n

  const existingBoostAssets = leverage
    ? BigInt(leverage.assets || 0) + BigInt(leverage.exitingAssets || 0)
    : 0n

  const boostOsTokenShares = existingBoostedShares + boostedSharesDelta
  const boostAssets = existingBoostAssets

  const netOsTokenShares = walletOsTokenShares + boostOsTokenShares - mintedOsTokenShares
  const netOsTokenAssets = convertSigned(netOsTokenShares, osTokenTotalAssets, osTokenTotalSupply)

  let totalAssets = stakedAssets + exitingAssets + boostAssets + netOsTokenAssets

  if (totalAssets < 0n) {
    totalAssets = 0n
  }

  if (totalAssets <= 0n) {
    return { apy: 0, totalAssets: 0n }
  }

  let totalEarnedAssets = getAnnualReward(stakedAssets, vaultApy)

  if (mintedOsTokenShares > 0n && vault.isOsTokenEnabled) {
    const mintedOsTokenAssets = convertOsTokenSharesToAssets(mintedOsTokenShares, osTokenTotalAssets, osTokenTotalSupply)

    totalEarnedAssets -= getAnnualReward(mintedOsTokenAssets, osTokenMintApy)
  }

  totalEarnedAssets += await getBoostReward({
    ...apyData,
    url,
    leverage,
    vaultAddress,
    boostedSharesDelta,
    isCollateralized: vault.isCollateralized,
  })

  totalEarnedAssets += getSignedAnnualReward(netOsTokenAssets, osTokenApy)

  const stakerApy = new BigDecimal(totalEarnedAssets).divide(totalAssets).multiply(100).toNumber()

  const apy = capBoostApy({ apy: stakerApy, vaultApy, allocatorMaxBoostApy })

  return { apy, totalAssets }
}


export default wrapAbortPromise<GetStakerPositionInput, Output>(getStakerPosition)
