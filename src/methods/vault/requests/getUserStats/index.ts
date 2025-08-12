import { apiUrls, validateArgs, calculateUserStats, getTimestamp } from '../../../../utils'
import graphql from '../../../../graphql'

import specialFetch from './specialFetch'


type GetUserStatsInput = {
  daysCount: number
  userAddress: string
  vaultAddress: string
  options: StakeWise.Options
  isSpecial?: boolean
}

const getUserStats = async (input: GetUserStatsInput) => {
  const { options, userAddress, vaultAddress, daysCount, isSpecial } = input

  validateArgs.address({ vaultAddress, userAddress })
  validateArgs.number({ daysCount })

  if (isSpecial) {
    return specialFetch(input)
  }

  return graphql.subgraph.vault.fetchUserRewardsQuery({
    url: apiUrls.getSubgraphqlUrl(options),
    variables: {
      limit: daysCount,
      where: {
        timestamp_gte: String(getTimestamp(daysCount)),
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
