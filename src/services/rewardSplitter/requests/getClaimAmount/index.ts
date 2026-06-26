import * as z from 'zod/mini'

import { apiUrls, schema, parseArgs } from '../../../../helpers'
import modifyClaimAmount from './modifyClaimAmount'
import graphql from '../../../../graphql'


const validateSchema = z.object({
  userAddress: schema.ethAddressLower,
  vaultAddress: schema.ethAddressLower,
  rewardSplitterAddress: schema.ethAddress,
})

export type GetClaimAmountInput = StakeWise.CommonParams & z.input<typeof validateSchema>

const getClaimAmount = (input: GetClaimAmountInput) => {
  const { options } = input

  const { vaultAddress, userAddress, rewardSplitterAddress } = parseArgs(validateSchema, input)

  return graphql.subgraph.rewardSplitters.fetchRewardSplitterShareHoldersQuery({
    url: apiUrls.getSubgraphqlUrl(options),
    variables: {
      vaultAddress,
      address: userAddress,
      rewardSplitterAddress: rewardSplitterAddress.toLowerCase(),
    },
    modifyResult: (data) => modifyClaimAmount({ ...data, rewardSplitterAddress }),
  })
}


export default getClaimAmount
