import graphql from '../../../../graphql'
import modifyQueuePosition from './modifyQueuePosition'
import { apiUrls, parseArgs, baseInputSchema } from '../../../../helpers'
import type { ParseBoostQueueOutput } from './modifyQueuePosition'


export type GetQueuePositionInput = StakeWise.BaseInput

export type Output = ParseBoostQueueOutput

const getQueuePosition = (input: GetQueuePositionInput) => {
  const { options, vaultAddress, userAddress } = input

  parseArgs(baseInputSchema, input)

  return graphql.subgraph.boost.fetchBoostQueuePositionsQuery({
    url: apiUrls.getSubgraphqlUrl(options),
    variables: {
      userAddress: userAddress.toLowerCase(),
      vaultAddress: vaultAddress.toLowerCase(),
    },
    modifyResult: modifyQueuePosition,
  })
}


export default getQueuePosition
