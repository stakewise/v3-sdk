import { apiUrls, validateArgs } from '../../../../utils'
import modifyClaimAmount from './modifyClaimAmount'
import graphql from '../../../../graphql'


type GetClaimAmountInput = {
  vaultAddress: string
  userAddress: string
  options: StakeWise.Options
  rewardSplitterAddress: string
  contracts: StakeWise.Contracts
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
