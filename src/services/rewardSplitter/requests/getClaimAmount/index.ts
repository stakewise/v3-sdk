import type * as z from 'zod/mini'

import { apiUrls } from '../../../../helpers'
import graphql from '../../../../graphql'

import modifyClaimAmount from './modifyClaimAmount'
import { validate, validateSchema } from './validate'


export type GetClaimAmountInput = StakeWise.CommonParams & z.input<typeof validateSchema>

const getClaimAmount = (input: GetClaimAmountInput) => {
  const { options } = input

  const { vaultAddress, userAddress, rewardSplitterAddress } = validate(input)

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
