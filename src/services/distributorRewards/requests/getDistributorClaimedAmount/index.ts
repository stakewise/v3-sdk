import { apiUrls, validateArgs } from '../../../../helpers'
import graphql from '../../../../graphql'


export type GetDistributorClaimedAmountInput = StakeWise.CommonParams & {
  id: string
}

const getDistributorClaimedAmount = (input: GetDistributorClaimedAmountInput) => {
  const { id, options } = input

  validateArgs.string({ id })

  return graphql.subgraph.distributorRewards.fetchDistributorClaimedAmountQuery({
    url: apiUrls.getSubgraphqlUrl(options),
    variables: {
      id: id.toLowerCase(),
    },
    modifyResult: (data) => data.distributorClaimedAmount?.cumulativeClaimedAmount || null,
  })
}


export default getDistributorClaimedAmount
