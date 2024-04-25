import graphql from '../../../../graphql'
import { apiUrls } from '../../../../utils'
import { RewardSplittersQueryPayload, RewardSplittersQueryVariables } from '../../../../graphql/subgraph/rewardSplitters'


type ValidateShareHoldersInput = {
  vaultAddress: string
  userAddress: string
  rewardSplitterAddress: string
  options: StakeWise.Options
}

const validateShareHolders = (input: ValidateShareHoldersInput) => {
  const { vaultAddress, userAddress, rewardSplitterAddress, options } = input

  const id = rewardSplitterAddress.toLowerCase()
  const vault = vaultAddress.toLowerCase()
  const address = userAddress.toLowerCase()
  const modifyResult = (data: RewardSplittersQueryPayload) => data.rewardSplitters.length > 0

  return graphql.subgraph.rewardSplitters.fetchRewardSplittersQuery<boolean>({
    url: apiUrls.getSubgraphqlUrl(options),
    variables: {
      where: {
        id,
        vault,
        shareHolders_: { address },
      } as RewardSplittersQueryVariables['where'],
    },
    modifyResult,
  })
}


export default validateShareHolders
