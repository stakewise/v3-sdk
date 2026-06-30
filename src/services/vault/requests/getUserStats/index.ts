import * as z from 'zod/mini'

import { apiUrls, schema, parseArgs, baseInputSchema, calculateUserStats } from '../../../../helpers'
import graphql from '../../../../graphql'


const validateSchema = z.extend(baseInputSchema, {
  daysCount: schema.number,
})

export type GetUserStatsInput = StakeWise.CommonParams & z.input<typeof validateSchema>

const getUserStats = (input: GetUserStatsInput) => {
  const { options, daysCount, userAddress, vaultAddress } = input

  parseArgs(validateSchema, input)

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
