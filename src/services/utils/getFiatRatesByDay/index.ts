import graphql from '../../../graphql'
import { wrapAbortPromise } from '../../../modules/gql-module'
import type { FiatByDayQueryPayload } from '../../../graphql/subgraph/stats'
import {
  apiUrls,
  Network,
  configs,
  calculateLimit,
} from '../../../helpers'


export type GetFiatRatesByDayInput = StakeWise.CommonParams & {
  dateTo: number
  dateFrom: number
}

type Output = FiatByDayQueryPayload['exchangeRate']

const emptyGnosisRates: Record<string, string> = {}

const fetchFiatRatesByDay = async (input: GetFiatRatesByDayInput): Promise<Output> => {
  const { options, dateFrom, dateTo } = input

  const isGnosis = Network.Gnosis === options.network

  const variables = {
    dateTo: String(dateTo * 1_000),
    dateFrom: String(dateFrom * 1_000),
    limit: calculateLimit(dateTo, dateFrom),
  }

  const [ fiatRates, gnosisRates ] = await Promise.all([
    graphql.subgraph.stats.fetchFiatByDayQuery({
      variables,
      url: configs[Network.Mainnet].api.subgraph,
      modifyResult: (data) => data.exchangeRate,
    }),
    isGnosis
      ? graphql.subgraph.stats.fetchFiatByDayQuery({
        variables,
        url: apiUrls.getSubgraphqlUrl(options),
        modifyResult: (data) => data.exchangeRate.reduce((acc, { timestamp, assetsUsdRate }) => ({
          ...acc,
          [timestamp]: assetsUsdRate,
        }), emptyGnosisRates),
      })
      : Promise.resolve(emptyGnosisRates),
  ])

  if (isGnosis) {
    return fiatRates.map((rate) => ({ ...rate, assetsUsdRate: gnosisRates[rate.timestamp] || '0' }))
  }

  return fiatRates
}


export const getFiatRatesByDay = wrapAbortPromise<GetFiatRatesByDayInput, Output>(fetchFiatRatesByDay)
