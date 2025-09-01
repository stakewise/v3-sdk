import graphql from '../../../../graphql'
import { wrapAbortPromise } from '../../../../modules/gql-module'
import { validateArgs, apiUrls, Network, constants, BorrowStatus } from '../../../../utils'
import modifyLeverageStrategyData, { Output as LeverageStrategyData } from '../../util/modifyLeverageStrategyData'


type GetBoostInput = {
  userAddress: string
  vaultAddress: string
  options: StakeWise.Options
  contracts: StakeWise.Contracts
}

type Output = {
  shares: bigint
  vaultApy: number
  totalShares: bigint
  borrowStatus: BorrowStatus
  rewardAssets: bigint
  maxMintShares: bigint
  exitingPercent: number
  borrowedAssets: bigint
  allocatorMaxBoostApy: number
  osTokenHolderMaxBoostApy: number
  leverageStrategyData: LeverageStrategyData
}

const getData = async (values: GetBoostInput) => {
  const { contracts, options, vaultAddress, userAddress } = values

  validateArgs.address({ vaultAddress, userAddress })

  const boost: Output = {
    shares: 0n,
    vaultApy: 0,
    totalShares: 0n,
    borrowStatus: BorrowStatus.Healthy,
    rewardAssets: 0n,
    exitingPercent: 0,
    maxMintShares: 0n,
    borrowedAssets: 0n,
    allocatorMaxBoostApy: 0,
    osTokenHolderMaxBoostApy: 0,
    leverageStrategyData: {
      version: 2,
      isUpgradeRequired: false,
    },
  }

  if ([ Network.Mainnet, Network.Hoodi ].includes(options.network)) {
    const boostMainData = await graphql.subgraph.boost.fetchBoostMainDataQuery({
      url: apiUrls.getSubgraphqlUrl(options),
      variables: {
        userAddress: userAddress.toLowerCase(),
        vaultAddress: vaultAddress.toLowerCase(),
      },
    })

    const { leverageStrategyPositions, vaults, allocators } = boostMainData

    if (!vaults.length) {
      return boost
    }

    const {
      apy,
      osTokenConfig,
      allocatorMaxBoostApy,
      osTokenHolderMaxBoostApy,
    } = vaults[0]

    const leverageStrategyPosition = leverageStrategyPositions[0]

    const aaveData = await graphql.subgraph.boost.fetchAavePositionsQuery({
      url: apiUrls.getSubgraphqlUrl(options),
      variables: {
        proxyAddress: (leverageStrategyPosition?.proxy || '').toLowerCase(),
      },
    })

    const stakedAssets = BigInt(allocators[0]?.assets || 0)
    const ltvPercent = BigInt(osTokenConfig.ltvPercent || 0)
    const borrowLtv = Number(leverageStrategyPosition?.borrowLtv || 0)
    const shares = BigInt(leverageStrategyPosition?.osTokenShares || 0)
    const exitingPercent = Number(leverageStrategyPosition?.exitingPercent || 0)
    const rewardAssets = BigInt(leverageStrategyPosition?.boostRewardAssets || 0)
    const borrowedAssets = BigInt(aaveData?.aavePositions[0]?.borrowedAssets || 0)
    const leverageStrategyData = modifyLeverageStrategyData({ leverageStrategyPositions })

    const maxMintAssets = stakedAssets * ltvPercent / constants.blockchain.amount1
    const maxMintShares = await contracts.base.mintTokenController.convertToShares(maxMintAssets)
    const rewardShares = await contracts.base.mintTokenController.convertToShares(rewardAssets)

    let borrowStatus: BorrowStatus

    if (borrowLtv <= 0.938) {
      borrowStatus = BorrowStatus.Healthy
    }
    else if (borrowLtv <= 0.945) {
      borrowStatus = BorrowStatus.Moderate
    }
    else {
      borrowStatus = BorrowStatus.Risky
    }

    const totalShares = shares + rewardShares

    return {
      shares,
      totalShares,
      borrowStatus,
      rewardAssets,
      maxMintShares,
      exitingPercent,
      borrowedAssets,
      leverageStrategyData,
      vaultApy: Number(apy),
      allocatorMaxBoostApy: Number(allocatorMaxBoostApy),
      osTokenHolderMaxBoostApy: Number(osTokenHolderMaxBoostApy),
    }
  }

  return boost
}


export default wrapAbortPromise<GetBoostInput, Output>(getData)
