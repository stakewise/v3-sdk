import { apiUrls, validateArgs } from '../../../../utils'
import modifyRewards from './modifyRewards'
import graphql from '../../../../graphql'


export type GetRewardsInput = StakeWise.CommonParams & {
  userAddress: string
}

const getRewards = (input: GetRewardsInput) => {
  const { userAddress, options } = input

  validateArgs.address({ userAddress })

  return graphql.subgraph.distributorRewards.fetchDistributorRewardsQuery({
    url: apiUrls.getSubgraphqlUrl(options),
    variables: {
      address: userAddress.toLowerCase(),
    },
    modifyResult: modifyRewards,
  })
}


export default getRewards
