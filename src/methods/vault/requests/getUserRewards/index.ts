import { apiUrls, Network, validateArgs, MergedReward, configs, mergeRewardsFiat } from '../../../../utils'
import graphql from '../../../../graphql'
import { wrapAbortPromise } from '../../../../modules/gql-module'
import { StakeWiseSubgraphGraph } from '../../../../types/graphql/subgraph'
import type { UserRewardsQueryVariables } from '../../../../graphql/subgraph/vault'


type GetUserRewardsInput = {
  dateTo: number
  dateFrom: number
  options: StakeWise.Options
  userAddress: UserRewardsQueryVariables['where']['allocator_']['address']
  vaultAddress: UserRewardsQueryVariables['where']['allocator_']['vault']
}

const getUserRewards = async (input: GetUserRewardsInput): Promise<MergedReward[]> => {
  const { options, vaultAddress, userAddress, dateFrom, dateTo } = input

  validateArgs.address({ vaultAddress, userAddress })
  validateArgs.number({ dateFrom, dateTo })

  const isGnosis = [
    Network.Gnosis,
    Network.Chiado,
  ].includes(options.network)

  const subgraphUrl = apiUrls.getSubgraphqlUrl(options)

  // We can't fetch GPB rates from gnosis subgraph
  const ratesUrl = isGnosis
    ? configs[Network.Mainnet].api.subgraph
    : subgraphUrl

  const timestampTo = String(dateTo * 1_000)
  const timestampFrom = String(dateFrom * 1_000)

  const [ fiatRates, rewards ] = await Promise.all([
    graphql.subgraph.stats.fetchFiatByDayQuery({
      url: ratesUrl,
      variables: {
        dateTo: timestampTo,
        dateFrom: timestampFrom,
      },
      modifyResult: (data) => data.exchangeRate || [],
    }),
    graphql.subgraph.vault.fetchUserRewardsQuery({
      url: subgraphUrl,
      variables: {
        where: {
          timestamp_lte: timestampTo,
          timestamp_gte: timestampFrom,
          allocator_: {
            address: userAddress.toLowerCase(),
            vault: vaultAddress.toLowerCase(),
          },
        } as StakeWiseSubgraphGraph.AllocatorStats_Filter,
      },
      modifyResult: (data) => data?.allocator || [],
    }),
  ])

  return mergeRewardsFiat({
    fiatRates,
    rewards,
  })
}


export default wrapAbortPromise<GetUserRewardsInput, MergedReward[]>(getUserRewards)
