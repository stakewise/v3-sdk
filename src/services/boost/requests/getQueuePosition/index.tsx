import * as z from 'zod/mini'

import graphql from '../../../../graphql'
import modifyQueuePosition from './modifyQueuePosition'
import { apiUrls, schema, parseArgs } from '../../../../helpers'
import type { ParseBoostQueueOutput } from './modifyQueuePosition'


const validateSchema = z.object({
  vaultAddress: schema.ethAddressLower,
  userAddress: schema.ethAddressLower,
})

export type GetQueuePositionInput = StakeWise.CommonParams & z.input<typeof validateSchema>

export type Output = ParseBoostQueueOutput

const getQueuePosition = (input: GetQueuePositionInput) => {
  const { options } = input

  const { vaultAddress, userAddress } = parseArgs(validateSchema, input)

  return graphql.subgraph.boost.fetchBoostQueuePositionsQuery({
    url: apiUrls.getSubgraphqlUrl(options),
    variables: {
      userAddress,
      vaultAddress,
    },
    modifyResult: modifyQueuePosition,
  })
}


export default getQueuePosition
