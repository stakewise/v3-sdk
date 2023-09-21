import { apiUrls } from 'helpers'
import { subgraph } from 'graphql'


type GetRewardSplittersInput = {
  userAddress: string
  vaultAddress: string
  options: StakeWise.Options
}

const getRewardSplitters = async (values: GetRewardSplittersInput) => {
  const { options, vaultAddress, userAddress } = values

  const result = await subgraph.rewardSplitters.fetchRewardSplittersQuery({
    url: apiUrls.getSubgraphqlUrl(options),
    variables: {
      owner: userAddress,
      vaultAddress: vaultAddress.toLowerCase(),
    },
  })

  return result?.rewardSplitters || []
}


export default getRewardSplitters
