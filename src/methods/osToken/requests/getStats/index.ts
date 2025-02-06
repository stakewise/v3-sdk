import { apiUrls, getTimestamp, validateArgs } from '../../../../utils'
import modifyStats from './modifyStats'
import graphql from '../../../../graphql'


type GetStatsInput = {
  options: StakeWise.Options
  daysCount: number
}

const getStats = (input: GetStatsInput) => {
  const { options, daysCount } = input

  validateArgs.number({ daysCount })

  const timestamp = String(getTimestamp(daysCount))

  return graphql.subgraph.osToken.fetchOsTokenStatsQuery({
    url: apiUrls.getSubgraphqlUrl(options),
    variables: {
      first: daysCount,
      where: {
        timestamp_gte: timestamp,
      },
    },
    modifyResult: modifyStats,
  })
}


export default getStats
