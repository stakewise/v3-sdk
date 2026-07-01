import graphql from '../../../../graphql'
import { apiUrls } from '../../../../helpers'

import { validate } from './validate'
import modifyQueuePosition from './modifyQueuePosition'
import type { ParseBoostQueueOutput } from './modifyQueuePosition'


export type GetQueuePositionInput = StakeWise.BaseInput

export type Output = ParseBoostQueueOutput

const getQueuePosition = (input: GetQueuePositionInput) => {
  const { options } = input

  const { vaultAddress, userAddress } = validate(input)

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
