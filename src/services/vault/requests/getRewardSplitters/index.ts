import { z } from 'zod'

import { apiUrls, schema, parseArgs } from '../../../../helpers'
import { fetchRewardSplittersQuery } from '../../../../graphql/subgraph/rewardSplitters'
import type { RewardSplittersQueryVariables } from '../../../../graphql/subgraph/rewardSplitters'

import modifyRewardSplitters from './modifyRewardSplitters'


const validateSchema = z.object({
  vaultAddress: schema.ethAddress,
  owner: schema.ethAddress.optional(),
  id: schema.ethAddress.optional(),
})

export type GetRewardSplittersInput = StakeWise.CommonParams & z.input<typeof validateSchema>

const getRewardSplitters = (input: GetRewardSplittersInput) => {
  const { id, owner, vaultAddress, options } = input

  if (!id && !owner) {
    throw new Error('You must pass either ID or OWNER to get a response')
  }

  parseArgs(validateSchema, input)

  const where = {
    vault: vaultAddress.toLowerCase(),
  } as RewardSplittersQueryVariables['where']

  if (typeof owner !== 'undefined') {
    where.owner = owner.toLowerCase()
  }

  if (typeof id !== 'undefined') {
    where.id = id.toLowerCase()
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
