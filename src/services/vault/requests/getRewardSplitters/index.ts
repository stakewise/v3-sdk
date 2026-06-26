import * as z from 'zod/mini'

import { apiUrls, schema, parseArgs } from '../../../../helpers'
import { fetchRewardSplittersQuery } from '../../../../graphql/subgraph/rewardSplitters'
import type { RewardSplittersQueryVariables } from '../../../../graphql/subgraph/rewardSplitters'

import modifyRewardSplitters from './modifyRewardSplitters'


const validateSchema = z.object({
  vaultAddress: schema.ethAddressLower,
  id: z.optional(schema.ethAddressLower),
  owner: z.optional(schema.ethAddressLower),
})

export type GetRewardSplittersInput = StakeWise.CommonParams & z.input<typeof validateSchema>

const getRewardSplitters = (input: GetRewardSplittersInput) => {
  const { options } = input

  if (!input.id && !input.owner) {
    throw new Error('You must pass either ID or OWNER to get a response')
  }

  const { id, owner, vaultAddress } = parseArgs(validateSchema, input)

  const where = {
    vault: vaultAddress,
  } as RewardSplittersQueryVariables['where']

  if (typeof owner !== 'undefined') {
    where.owner = owner
  }

  if (typeof id !== 'undefined') {
    where.id = id
  }

  return fetchRewardSplittersQuery({
    url: apiUrls.getSubgraphqlUrl(options),
    variables: {
      where,
    },
    modifyResult: modifyRewardSplitters,
  })
}


export default getRewardSplitters
