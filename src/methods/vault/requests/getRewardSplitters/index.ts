import { apiUrls, validateArgs } from '../../../../utils'
import { fetchRewardSplittersQuery } from '../../../../graphql/subgraph/rewardSplitters'
import type { RewardSplittersQueryVariables } from '../../../../graphql/subgraph/rewardSplitters'

import modifyRewardSplitters from './modifyRewardSplitters'


type GetRewardSplittersInput = {
  owner: string
  vaultAddress: string
  rewardSplitterAddress?: string
  options: StakeWise.Options
}

const getRewardSplitters = (input: GetRewardSplittersInput) => {
  const { owner, vaultAddress, rewardSplitterAddress, options } = input

  validateArgs.address({ owner, vaultAddress })

  const where = {
    vault: vaultAddress.toLowerCase(),
    owner: owner.toLowerCase(),
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
