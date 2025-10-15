import { Network, configs } from '../../../utils'
import graphql from '../../../graphql'


type GetFiatRatesByDayInput = {
  dateTo: number
  dateFrom: number
}

const calculateLimit = (dateTo: number, dateFrom: number): number => {
  const millisecondsInDay = 1000 * 60 * 60 * 24

  return Math.floor((dateTo - dateFrom) / millisecondsInDay)
}

const getFiatRatesByDay = (input: Pick<GetFiatRatesByDayInput, 'dateFrom' | 'dateTo'>) => {
  const { dateFrom, dateTo } = input

  return graphql.subgraph.stats.fetchFiatByDayQuery({
    url: configs[Network.Mainnet].api.subgraph,
    variables: {
      limit: calculateLimit(dateTo, dateFrom),
    },
    modifyResult: (data) => data.exchangeRate,
  })
}


export default getFiatRatesByDay
