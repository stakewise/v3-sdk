import { Network, configs } from '../../../helpers'
import graphql from '../../../graphql'


export type GetFiatRatesByDayInput = {
  dateTo: number
  dateFrom: number
}

const calculateLimit = (dateTo: number, dateFrom: number): number => {
  const millisecondsInDay = 1000 * 60 * 60 * 24

  return Math.floor((dateTo - dateFrom) / millisecondsInDay)
}

export const getFiatRatesByDay = (input: Pick<GetFiatRatesByDayInput, 'dateFrom' | 'dateTo'>) => {
  const { dateFrom, dateTo } = input

  return graphql.subgraph.stats.fetchFiatByDayQuery({
    url: configs[Network.Mainnet].api.subgraph,
    variables: {
      dateTo: String(dateTo * 1_000),
      dateFrom: String(dateFrom * 1_000),
      limit: calculateLimit(dateTo, dateFrom),
    },
    modifyResult: (data) => data.exchangeRate,
  })
}
