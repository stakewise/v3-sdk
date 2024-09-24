import graphql from '../../graphql'
import { apiUrls } from '../../utils'


type GetStakewiseStatsInput = {
  options: StakeWise.Options
}

const getStakewiseStats = (values: GetStakewiseStatsInput) => {
  const { options } = values

  return graphql.subgraph.stats.fetchStatsQuery({
    url: apiUrls.getSubgraphqlUrl(options),
  })
}


export default getStakewiseStats
