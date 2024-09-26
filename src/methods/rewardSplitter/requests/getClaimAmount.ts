import { apiUrls, validateArgs } from '../../../utils'
import graphql from '../../../graphql'


type GetClaimAmountInput = {
  vaultAddress: string
  userAddress: string
  rewardSplitterAddress: string
  options: StakeWise.Options
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
    modifyResult: (data) => BigInt(data.rewardSplitterShareHolders?.[0]?.earnedVaultAssets || 0),
  })
}


export default getClaimAmount
