import type { UserStatsQueryVariables } from '../../../../graphql/subgraph/vault'
import modifyUserStats from './modifyUserStats'
import { apiUrls, validateArgs } from '../../../../utils'
import graphql from '../../../../graphql'


type GetStatsCollectionInput = {
  first: number
  options: StakeWise.Options
  userAddress: UserStatsQueryVariables['user']
  vaultAddress: UserStatsQueryVariables['vaultAddress']
}

const getUserStats = (input: GetStatsCollectionInput) => {
  const { options, userAddress, vaultAddress, first } = input

  validateArgs.address({ vaultAddress, userAddress })
  validateArgs.number({ first })

  return graphql.subgraph.vault.fetchUserStatsQuery({
    url: apiUrls.getSubgraphqlUrl(options),
    variables: {
      first,
      user: userAddress.toLowerCase(),
      vaultAddress: vaultAddress.toLowerCase(),
    } as UserStatsQueryVariables,
    modifyResult: modifyUserStats,
  })
}


export default getUserStats
