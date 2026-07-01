import type * as z from 'zod/mini'

import graphql from '../../../../graphql'
import { apiUrls } from '../../../../helpers'

import modifyExitRequests from './modifyExitRequests'
import { validate, validateSchema } from './validate'


export type GetExitQueuePositionsInput = StakeWise.CommonParams & z.input<typeof validateSchema>

const getExitQueuePositions = (input: GetExitQueuePositionsInput) => {
  const { options } = input

  const { isClaimed, vaultAddress, userAddress } = validate(input)

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
