import { apiUrls, validateArgs } from '../../../../utils'
import { fetchRewardSplittersQuery } from '../../../../graphql/subgraph/rewardSplitters'
import type { RewardSplittersQueryVariables } from '../../../../graphql/subgraph/rewardSplitters'

import modifyRewardSplitters from './modifyRewardSplitters'


type GetRewardSplittersInput = {
  id: string
  vaultAddress: string
  rewardSplitterAddress?: string
  options: StakeWise.Options
}

const getRewardSplitters = (input: GetRewardSplittersInput) => {
  const { id, vaultAddress, rewardSplitterAddress, options } = input

  validateArgs.address({ id, vaultAddress })

  if (typeof rewardSplitterAddress !== 'undefined') {
    validateArgs.address({ rewardSplitterAddress })
  }

  const where = {
    vault: vaultAddress.toLowerCase(),
    id: id.toLowerCase(),
  } as RewardSplittersQueryVariables['where']

  if (rewardSplitterAddress) {
    where.id = rewardSplitterAddress.toLowerCase()
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
