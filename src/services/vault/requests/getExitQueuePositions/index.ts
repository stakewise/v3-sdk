import * as z from 'zod/mini'

import graphql from '../../../../graphql'
import { apiUrls, schema, parseArgs } from '../../../../helpers'

import modifyExitRequests from './modifyExitRequests'


const validateSchema = z.object({
  userAddress: schema.ethAddressLower,
  vaultAddress: schema.ethAddressLower,
  isClaimed: z.optional(schema.boolean),
})

export type GetExitQueuePositionsInput = StakeWise.CommonParams & z.input<typeof validateSchema>

const getExitQueuePositions = (input: GetExitQueuePositionsInput) => {
  const { options, isClaimed } = input

  const { vaultAddress, userAddress } = parseArgs(validateSchema, input)

  return graphql.subgraph.exitQueue.fetchExitQueueQuery({
    url: apiUrls.getSubgraphqlUrl(options),
    variables: {
      where: {
        vault: vaultAddress,
        receiver: userAddress,
        isClaimed,
      },
    },
    modifyResult: modifyExitRequests,
  })
}


export default getExitQueuePositions
