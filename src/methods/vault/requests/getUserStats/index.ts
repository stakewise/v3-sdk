import { apiUrls, validateArgs, calculateUserStats } from '../../../../utils'
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

  return graphql.subgraph.vault.fetchUserRewardsQuery({
    url: apiUrls.getSubgraphqlUrl(options),
    variables: {
      limit: daysCount,
      where: {
        allocator_: {
          address: userAddress.toLowerCase(),
          vault: vaultAddress.toLowerCase(),
        },
      },
    },
    modifyResult: (data) => calculateUserStats(data?.allocator || []),
  })
}


export default getUserStats
