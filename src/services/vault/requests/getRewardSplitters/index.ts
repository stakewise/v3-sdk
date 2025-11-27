import { apiUrls, validateArgs } from '../../../../utils'
import { fetchRewardSplittersQuery } from '../../../../graphql/subgraph/rewardSplitters'
import type { RewardSplittersQueryVariables } from '../../../../graphql/subgraph/rewardSplitters'

import modifyRewardSplitters from './modifyRewardSplitters'


export type GetRewardSplittersInput = StakeWise.CommonParams & {
  id?: string
  owner?: string
  vaultAddress: string
}

const getRewardSplitters = (input: GetRewardSplittersInput) => {
  const { id, owner, vaultAddress, options } = input

  if (!id && !owner) {
    throw new Error('You must pass either ID or OWNER to get a response')
  }

  validateArgs.address({ vaultAddress })

  const where = {
    vault: vaultAddress.toLowerCase(),
  } as RewardSplittersQueryVariables['where']

  if (typeof owner !== 'undefined') {
    validateArgs.address({ owner })

    where.owner = owner.toLowerCase()
  }

  if (typeof id !== 'undefined') {
    validateArgs.address({ id })

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
