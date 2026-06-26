import * as z from 'zod/mini'

import { apiUrls, schema, parseArgs, calculateUserStats } from '../../../../helpers'
import graphql from '../../../../graphql'


const validateSchema = z.object({
  daysCount: schema.number,
  userAddress: schema.ethAddressLower,
  vaultAddress: schema.ethAddressLower,
})

export type GetUserStatsInput = StakeWise.CommonParams & z.input<typeof validateSchema>

const getUserStats = (input: GetUserStatsInput) => {
  const { options, daysCount } = input

  const { userAddress, vaultAddress } = parseArgs(validateSchema, input)

  return graphql.subgraph.vault.fetchUserRewardsQuery({
    url: apiUrls.getSubgraphqlUrl(options),
    variables: {
      limit: daysCount,
      where: {
        allocator_: {
          vault: vaultAddress,
          address: userAddress,
        },
      },
    },
    modifyResult: (data) => calculateUserStats(data?.allocator || []),
  })
}


export default getUserStats
