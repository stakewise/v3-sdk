import * as z from 'zod/mini'

import graphql from '../../../../graphql'
import { apiUrls, schema, parseArgs, baseInputSchema } from '../../../../helpers'

import modifyExitRequests from './modifyExitRequests'


const validateSchema = z.extend(baseInputSchema, {
  isClaimed: z.optional(schema.boolean),
})

export type GetExitQueuePositionsInput = StakeWise.CommonParams & z.input<typeof validateSchema>

const getExitQueuePositions = (input: GetExitQueuePositionsInput) => {
  const { options, isClaimed, vaultAddress, userAddress } = input

  parseArgs(validateSchema, input)

  return graphql.subgraph.exitQueue.fetchExitQueueQuery({
    url: apiUrls.getSubgraphqlUrl(options),
    variables: {
      where: {
        isClaimed,
        vault: vaultAddress.toLowerCase(),
        receiver: userAddress.toLowerCase(),
      },
    },
    modifyResult: modifyExitRequests,
  })
}


export default getExitQueuePositions
