import graphql from '../../../../graphql'
import { apiUrls, validateArgs } from '../../../../helpers'
import modifyExitRequests from './modifyExitRequests'
import type { ParseExitRequestsOutput } from './modifyExitRequests'


export type GetExitQueuePositionsInput = StakeWise.CommonParams & {
  vaultAddress: string
  userAddress: string
  isClaimed?: boolean
}

const getExitQueuePositions = async (input: GetExitQueuePositionsInput): Promise<ParseExitRequestsOutput> => {
  const { options, vaultAddress, userAddress, isClaimed } = input

  validateArgs.address({ vaultAddress, userAddress })

  if (typeof isClaimed !== 'undefined') {
    validateArgs.boolean({ isClaimed })
  }

  return graphql.subgraph.exitQueue.fetchExitQueueQuery({
    url: apiUrls.getSubgraphqlUrl(options),
    variables: {
      where: {
        vault: vaultAddress.toLowerCase(),
        receiver: userAddress.toLowerCase(),
        isClaimed,
      },
    },
    modifyResult: modifyExitRequests,
  })
}


export default getExitQueuePositions
