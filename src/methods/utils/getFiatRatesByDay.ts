import { Network, configs } from '../../utils'
import graphql from '../../graphql'


type GetFiatRatesByDayInput = {
  dateTo: number
  dateFrom: number
}

const getFiatRatesByDay = (input: Pick<GetFiatRatesByDayInput, 'dateFrom' | 'dateTo'>) => {
  const { dateFrom, dateTo } = input

  return graphql.subgraph.stats.fetchFiatByDayQuery({
    url: configs[Network.Mainnet].api.subgraph,
    variables: {
      dateTo: String(dateTo * 1_000),
      dateFrom: String(dateFrom * 1_000),
    },
    modifyResult: (data) => data.exchangeRate,
  })
}


export default getFiatRatesByDay
