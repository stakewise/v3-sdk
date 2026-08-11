import type * as z from 'zod/mini'

import { apiUrls, calculateUserStats } from '../../../../helpers'
import graphql from '../../../../graphql'

import { validate, validateSchema } from './validate'


export type GetUserStatsInput = StakeWise.CommonParams & z.input<typeof validateSchema>

const getUserStats = (input: GetUserStatsInput) => {
  const { options } = input

  const { daysCount, userAddress, vaultAddress } = validate(input)

  return graphql.subgraph.vault.fetchUserRewardsQuery({
    url: apiUrls.getSubgraphqlUrl(options),
    variables: {
      limit: daysCount,
      where: {
        allocator_: {
          vault: vaultAddress.toLowerCase(),
          address: userAddress.toLowerCase(),
        },
      },
    },
    modifyResult: (data) => calculateUserStats(data?.allocator || []),
  })
}


export default getUserStats
