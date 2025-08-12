import { apiUrls, validateArgs, calculateUserStats, getTimestamp } from '../../../../utils'
import graphql from '../../../../graphql'


type GetUserStatsInput = {
  daysCount: number
  userAddress: string
  vaultAddress: string
  options: StakeWise.Options
  isSpecial?: boolean
}

const getUserStats = (input: GetUserStatsInput) => {
  const { options, userAddress, vaultAddress, daysCount, isSpecial } = input

  validateArgs.address({ vaultAddress, userAddress })
  validateArgs.number({ daysCount })

  const method = isSpecial
    ? graphql.subgraph.vault.fetchUserRewardsSpecialQuery
    : graphql.subgraph.vault.fetchUserRewardsQuery

  return method({
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
    modifyResult: (data) => calculateUserStats(data?.allocator || [], true),
  })
}


export default getUserStats
