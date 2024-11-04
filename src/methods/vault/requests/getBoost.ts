import graphql from '../../../graphql'
import { wrapAbortPromise } from '../../../modules/gql-module'
import { validateArgs, apiUrls, Network, constants } from '../../../utils'


type GetBoostInput = {
  userAddress: string
  vaultAddress: string
  options: StakeWise.Options
  contracts: StakeWise.Contracts
}

type Output = {
  shares: bigint
  rewardAssets: bigint
  exitingPercent: number
  maxMintShares: bigint
  isProfitable: boolean
}

const getBoost = async (values: GetBoostInput) => {
  const { contracts, options, vaultAddress, userAddress } = values

  validateArgs.address({ vaultAddress, userAddress })

  const boost: Output = {
    shares: 0n,
    rewardAssets: 0n,
    exitingPercent: 0,
    maxMintShares: 0n,
    isProfitable: false,
  }

  if ([ Network.Mainnet, Network.Holesky ].includes(options.network)) {
    const response = await graphql.subgraph.osToken.fetchBoostTokenSharesQuery({
      url: apiUrls.getSubgraphqlUrl(options),
      variables: {
        userAddress: userAddress.toLowerCase(),
        vaultAddress: vaultAddress.toLowerCase(),
      },
    })

    const { leverageStrategyPositions, vaults, allocators } = response

    if (!vaults.length) {
      return boost
    }

    const { apy, maxBoostApy, osTokenConfig } = vaults[0]

    const leverageStrategyPosition = leverageStrategyPositions[0]

    const stakedAssets = BigInt(allocators[0]?.assets || 0)
    const ltvPercent = BigInt(osTokenConfig.ltvPercent || 0)
    const shares = BigInt(leverageStrategyPosition?.osTokenShares || 0)
    const rewardAssets = BigInt(leverageStrategyPosition?.boostRewardAssets || 0)
    const exitingPercent = Number(leverageStrategyPosition?.exitingPercent || 0)

    const maxMintAssets = stakedAssets * ltvPercent / constants.blockchain.amount1
    const maxMintShares = await contracts.base.mintTokenController.convertToShares(maxMintAssets)

    return {
      shares,
      rewardAssets,
      maxMintShares,
      exitingPercent,
      isProfitable: Number(maxBoostApy) > Number(apy),
    }
  }

  return boost
}


export default wrapAbortPromise<GetBoostInput, Output>(getBoost)
