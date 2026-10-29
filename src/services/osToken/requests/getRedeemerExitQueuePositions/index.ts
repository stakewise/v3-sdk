import type * as z from 'zod/mini'

import graphql from '../../../../graphql'
import { apiUrls } from '../../../../helpers'

import modifyRedeemerExitRequests from './modifyRedeemerExitRequests'
import { validate, validateSchema } from './validate'


export type GetRedeemerExitQueuePositionsInput = StakeWise.CommonParams & z.input<typeof validateSchema>

const getRedeemerExitQueuePositions = (input: GetRedeemerExitQueuePositionsInput) => {
  const { options } = input

  const { isClaimed, userAddress } = validate(input)

  return graphql.subgraph.redeemerExitQueue.fetchRedeemerExitQueueQuery({
    ...apiUrls.getSubgraphParams(options),
    variables: {
      where: {
        isClaimed,
        receiver: userAddress.toLowerCase(),
      },
    },
    modifyResult: modifyRedeemerExitRequests,
  })
}


export default getRedeemerExitQueuePositions
