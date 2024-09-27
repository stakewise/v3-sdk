import type { UserStatsQueryVariables } from '../../../../graphql/subgraph/vault'
import modifyUserStats from './modifyUserStats'
import { apiUrls, validateArgs } from '../../../../utils'
import graphql from '../../../../graphql'


type GetUserStatsInput = {
  daysCount: number
  options: StakeWise.Options
  userAddress: UserStatsQueryVariables['user']
  vaultAddress: UserStatsQueryVariables['vaultAddress']
}

const getUserStats = (input: GetUserStatsInput) => {
  const { options, userAddress, vaultAddress, daysCount } = input

  validateArgs.address({ vaultAddress, userAddress })
  validateArgs.number({ daysCount })

  return graphql.subgraph.vault.fetchUserStatsQuery({
    url: apiUrls.getSubgraphqlUrl(options),
    variables: {
      daysCount,
      user: userAddress.toLowerCase(),
      vaultAddress: vaultAddress.toLowerCase(),
    } as UserStatsQueryVariables,
    modifyResult: modifyUserStats,
  })
}


export default getUserStats
