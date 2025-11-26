import graphql from '../../../graphql'
import { apiUrls } from '../../../utils'


export const getStakewiseStats = (values: StakeWise.CommonParams) => {
  const { options } = values

  return graphql.subgraph.stats.fetchStatsQuery({
    url: apiUrls.getSubgraphqlUrl(options),
    modifyResult: (data) => ({
      usersCount: data.networks[0].usersCount,
      totalAssets: data.networks[0].totalAssets,
      totalEarnedAssets: data.networks[0].totalEarnedAssets,
    }),
  })
}
