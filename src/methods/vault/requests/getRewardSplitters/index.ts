import { apiUrls, validateArgs } from '../../../../utils'
import { fetchRewardSplittersQuery } from '../../../../graphql/subgraph/rewardSplitters'
import type { RewardSplittersQueryVariables } from '../../../../graphql/subgraph/rewardSplitters'

import modifyRewardSplitters from './modifyRewardSplitters'


type GetRewardSplittersInput = {
  owner: string
  vaultAddress: string
  shareHolderAddress?: string
  rewardSplitterAddress?: string
  options: StakeWise.Options
}

const getRewardSplitters = (input: GetRewardSplittersInput) => {
  const { owner, vaultAddress, shareHolderAddress, rewardSplitterAddress, options } = input

  validateArgs.address({ owner, vaultAddress })

  if (typeof shareHolderAddress !== 'undefined') {
    validateArgs.address({ shareHolderAddress })
  }
  if (typeof rewardSplitterAddress !== 'undefined') {
    validateArgs.address({ rewardSplitterAddress })
  }

  const where = {
    vault: vaultAddress.toLowerCase(),
    owner: owner.toLowerCase(),
  } as RewardSplittersQueryVariables['where']

  if (rewardSplitterAddress) {
    where.id = rewardSplitterAddress.toLowerCase()
  }
  if (shareHolderAddress) {
    where.shareHolders_ = { address: shareHolderAddress.toLowerCase() } as RewardSplittersQueryVariables['where']['shareHolders_']
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
