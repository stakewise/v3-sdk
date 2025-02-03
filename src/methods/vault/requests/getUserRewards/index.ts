import { apiUrls, Network, validateArgs, MergedReward, configs, mergeRewardsFiat } from '../../../../utils'
import graphql from '../../../../graphql'
import { wrapAbortPromise } from '../../../../modules/gql-module'


type GetUserRewardsInput = {
  dateTo: number
  dateFrom: number
  options: StakeWise.Options
  userAddress: string
  vaultAddress: string
}

const calculateLimit = (dateTo: number, dateFrom: number): number => {
  const millisecondsInDay = 1000 * 60 * 60 * 24

  return Math.floor((dateTo - dateFrom) / millisecondsInDay)
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

  const limit = calculateLimit(dateTo, dateFrom)

  const timestampTo = String(dateTo * 1_000)
  const timestampFrom = String(dateFrom * 1_000)

  const [ rewards, networkFiatRates, gnosisFiatRates ] = await Promise.all([
    graphql.subgraph.vault.fetchUserRewardsQuery({
      url: subgraphUrl,
      variables: {
        limit,
        where: {
          timestamp_lte: timestampTo,
          timestamp_gte: timestampFrom,
          allocator_: {
            address: userAddress.toLowerCase(),
            vault: vaultAddress.toLowerCase(),
          },
        },
      },
      modifyResult: (data) => data?.allocator || [],
    }),
    graphql.subgraph.stats.fetchFiatByDayQuery({
      url: ratesUrl,
      variables: {
        limit,
        dateTo: timestampTo,
        dateFrom: timestampFrom,
      },
      modifyResult: (data) => data.exchangeRate || [],
    }),
    isGnosis
      ? graphql.subgraph.stats.fetchFiatByDayQuery({
        url: subgraphUrl,
        variables: {
          limit,
          dateTo: timestampTo,
          dateFrom: timestampFrom,
        },
        modifyResult: (data) => (data.exchangeRate || [])
          .reduce((acc, { timestamp, assetsUsdRate }) => ({
            ...acc,
            [timestamp]: assetsUsdRate,
          }), {}),
      })
      : Promise.resolve({}),
  ])

  const fiatRates = isGnosis
    ? networkFiatRates.map((data) => ({
      ...data,
      assetsUsdRate: gnosisFiatRates[data.timestamp as keyof typeof gnosisFiatRates] || 0,
    }))
    : networkFiatRates

  return mergeRewardsFiat({
    rewards,
    fiatRates,
  })
}


export default wrapAbortPromise<GetUserRewardsInput, MergedReward[]>(getUserRewards)
