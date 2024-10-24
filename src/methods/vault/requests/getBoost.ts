import graphql from '../../../graphql'
import { wrapAbortPromise } from '../../../modules/gql-module'
import { validateArgs, apiUrls, BigDecimal, Network, constants } from '../../../utils'


type GetBoostInput = {
  userAddress: string
  vaultAddress: string
  options: StakeWise.Options
  contracts: StakeWise.Contracts
}

type Output = {
  shares: bigint
  percent: number
  maxMintShares: bigint
  isProfitable: boolean
}

const getBoost = async (values: GetBoostInput) => {
  const { contracts, options, vaultAddress, userAddress } = values

  validateArgs.address({ vaultAddress, userAddress })

  const boost: Output = {
    shares: 0n,
    percent: 0,
    maxMintShares: 0n,
    isProfitable: false,
  }

  if (options.network === Network.Mainnet) {
    const response = await graphql.subgraph.osToken.fetchBoostTokenSharesQuery({
      url: apiUrls.getSubgraphqlUrl(options),
      variables: {
        vaultAddress,
        userAddress,
      },
    })

    const { leverageStrategyPositions, vaults, allocators } = response

    if (!vaults.length) {
      return boost
    }

    const { apy, maxBoostApy, osTokenConfig } = vaults[0]

    const stakedAssets = BigInt(allocators[0]?.assets || 0)
    const ltvPercent = BigInt(osTokenConfig.ltvPercent || 0)
    const boostShares = BigInt(leverageStrategyPositions[0]?.osTokenShares || 0)

    const maxMintAssets = stakedAssets * ltvPercent / constants.blockchain.amount1
    const maxMintShares = await contracts.base.mintTokenController.convertToShares(maxMintAssets)

    const boostPercent = maxMintShares ? Number(
      new BigDecimal(boostShares)
        .multiply(100)
        .divide(maxMintShares)
        .decimals(2)
        .toString()
    ) : 0

    boost.shares = boostShares
    boost.percent = boostPercent
    boost.maxMintShares = maxMintShares
    boost.isProfitable = maxBoostApy > apy
  }

  return boost
}


export default wrapAbortPromise<GetBoostInput, Output>(getBoost)
