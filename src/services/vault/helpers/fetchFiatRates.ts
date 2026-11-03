import { apiUrls, Network, configs } from '../../../helpers'
import graphql from '../../../graphql'

import type { FiatByDayQueryPayload } from '../../../graphql/subgraph/stats'


type FetchFiatRatesInput = {
  limit: number
  timestampTo: string
  timestampFrom: string
  options: StakeWise.Options
}

type FiatRates = FiatByDayQueryPayload['exchangeRate']

const fetchFiatRates = async (values: FetchFiatRatesInput): Promise<FiatRates> => {
  const { limit, options, timestampTo, timestampFrom } = values

  const isGnosis = Network.Gnosis === options.network

  const subgraphParams = apiUrls.getSubgraphParams(options)

  // We can't fetch GBP rates from gnosis subgraph
  const ratesUrl = isGnosis
    ? configs[Network.Mainnet].api.subgraph
    : subgraphParams.url

  const variables = {
    limit,
    dateTo: timestampTo,
    dateFrom: timestampFrom,
  }

  const [ networkFiatRates, gnosisFiatRates ] = await Promise.all([
    graphql.subgraph.stats.fetchFiatByDayQuery({
      ...subgraphParams,
      url: ratesUrl,
      variables,
      modifyResult: (data) => data.exchangeRate || [],
    }),
    isGnosis
      ? graphql.subgraph.stats.fetchFiatByDayQuery({
        ...subgraphParams,
        variables,
        modifyResult: (data) => (data.exchangeRate || [])
          .reduce((acc, { timestamp, assetsUsdRate }) => ({
            ...acc,
            [timestamp]: assetsUsdRate,
          }), {}),
      })
      : Promise.resolve({}),
  ])

  if (!isGnosis) {
    return networkFiatRates
  }

  return networkFiatRates.map((data) => ({
    ...data,
    assetsUsdRate: gnosisFiatRates[data.timestamp as keyof typeof gnosisFiatRates] || 0,
  }))
}


export default fetchFiatRates
