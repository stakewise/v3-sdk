import * as z from 'zod/mini'

import { apiUrls, schema, parseArgs } from '../../../../helpers'
import modifyRewards from './modifyRewards'
import graphql from '../../../../graphql'


const validateSchema = z.object({
  userAddress: schema.ethAddressLower,
})

export type GetRewardsInput = StakeWise.CommonParams & z.input<typeof validateSchema>

const getRewards = (input: GetRewardsInput) => {
  const { options } = input

  const { userAddress } = parseArgs(validateSchema, input)

  return graphql.subgraph.distributorRewards.fetchDistributorRewardsQuery({
    url: apiUrls.getSubgraphqlUrl(options),
    variables: {
      address: userAddress,
    },
    modifyResult: modifyRewards,
  })
}


export default getRewards
