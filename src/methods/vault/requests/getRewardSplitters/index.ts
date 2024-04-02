import { apiUrls, validateArgs } from '../../../../utils'
import { fetchRewardSplittersQuery } from '../../../../graphql/subgraph/rewardSplitters'
import type { RewardSplittersQueryVariables } from '../../../../graphql/subgraph/rewardSplitters'

import modifyRewardSplitters from './modifyRewardSplitters'


type GetRewardSplittersInput = {
  vaultAddress: string
  userAddress: string
  rewardSplitterAddress?: string
  options: StakeWise.Options
}

const getRewardSplitters = (input: GetRewardSplittersInput) => {
  const { vaultAddress, userAddress, rewardSplitterAddress, options } = input

  validateArgs.address({ vaultAddress, userAddress })

  const where = {
    vault: vaultAddress.toLowerCase(),
    owner: userAddress.toLowerCase(),
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
