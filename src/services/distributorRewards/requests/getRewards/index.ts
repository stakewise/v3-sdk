import type * as z from 'zod/mini'

import { apiUrls } from '../../../../helpers'
import graphql from '../../../../graphql'

import modifyRewards from './modifyRewards'
import { validate, validateSchema } from './validate'


export type GetRewardsInput = StakeWise.CommonParams & z.input<typeof validateSchema>

const getRewards = (input: GetRewardsInput) => {
  const { options } = input

  const { userAddress } = validate(input)

  return graphql.subgraph.distributorRewards.fetchDistributorRewardsQuery({
    url: apiUrls.getSubgraphqlUrl(options),
    variables: {
      address: userAddress,
    },
    modifyResult: modifyRewards,
  })
}


export default getRewards
