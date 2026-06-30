import * as z from 'zod/mini'

import { apiUrls, schema, parseArgs, baseInputSchema } from '../../../../helpers'
import graphql from '../../../../graphql'

import modifyClaimAmount from './modifyClaimAmount'


const validateSchema = z.extend(baseInputSchema, {
  rewardSplitterAddress: schema.ethAddress,
})

export type GetClaimAmountInput = StakeWise.CommonParams & z.input<typeof validateSchema>

const getClaimAmount = (input: GetClaimAmountInput) => {
  const { options, vaultAddress, userAddress, rewardSplitterAddress } = input

  parseArgs(validateSchema, input)

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
