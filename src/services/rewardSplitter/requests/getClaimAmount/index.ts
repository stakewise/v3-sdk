import { apiUrls, validateArgs } from '../../../../helpers'
import modifyClaimAmount from './modifyClaimAmount'
import graphql from '../../../../graphql'


export type GetClaimAmountInput = StakeWise.CommonParams & {
  vaultAddress: string
  userAddress: string
  rewardSplitterAddress: string
}

const getClaimAmount = (input: GetClaimAmountInput) => {
  const { vaultAddress, userAddress, rewardSplitterAddress, options } = input

  validateArgs.address({ vaultAddress, userAddress, rewardSplitterAddress })

  return graphql.subgraph.rewardSplitters.fetchRewardSplitterShareHoldersQuery({
    url: apiUrls.getSubgraphqlUrl(options),
    variables: {
      address: userAddress.toLowerCase(),
      vaultAddress: vaultAddress.toLowerCase(),
      rewardSplitterAddress: rewardSplitterAddress.toLowerCase(),
    },
    modifyResult: (data) => modifyClaimAmount({ ...data, rewardSplitterAddress }),
  })
}


export default getClaimAmount
