import { apiUrls, validateArgs, calculateUserStats, getTimestamp } from '../../../../utils'
import graphql from '../../../../graphql'


type GetUserStatsInput = {
  daysCount: number
  userAddress: string
  vaultAddress: string
  options: StakeWise.Options
}

const getUserStats = (input: GetUserStatsInput) => {
  const { options, userAddress, vaultAddress, daysCount } = input

  validateArgs.address({ vaultAddress, userAddress })
  validateArgs.number({ daysCount })

  const timestamp = String(getTimestamp(daysCount))

  return graphql.subgraph.vault.fetchUserStatsQuery({
    url: apiUrls.getSubgraphqlUrl(options),
    variables: {
      timestamp,
      userAddress: userAddress.toLowerCase(),
      vaultAddress: vaultAddress.toLowerCase(),
    },
    modifyResult: (response) => calculateUserStats(response.allocator),
  })
}


export default getUserStats
