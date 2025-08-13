import { apiUrls, validateArgs } from '../../../../utils'
import modifyRewards from './modifyRewards'
import graphql from '../../../../graphql'


type GetRewardsInput = {
  userAddress: string
  options: StakeWise.Options
  contracts: StakeWise.Contracts
}

const getRewards = (input: GetRewardsInput) => {
  const { userAddress, options } = input

  validateArgs.address({ userAddress })

  return graphql.subgraph.distributorRewards.fetchDistributorRewardsQuery({
    url: apiUrls.getSubgraphqlUrl(options),
    variables: {
      address: userAddress.toLowerCase(),
    },
    modifyResult: (data) => modifyRewards(data),
  })
}


export default getRewards
