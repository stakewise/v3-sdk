import graphql from '../../../../graphql'
import modifyQueuePosition from './modifyQueuePosition'
import { apiUrls, validateArgs } from '../../../../utils'
import type { ParseBoostQueueOutput } from './modifyQueuePosition'


type GetQueuePositionsInput = {
  options: StakeWise.Options
  vaultAddress: string
  userAddress: string
}

export type Output = ParseBoostQueueOutput

const getQueuePosition = async (input: GetQueuePositionsInput): Promise<ParseBoostQueueOutput> => {
  const { options, vaultAddress, userAddress } = input

  validateArgs.address({ vaultAddress, userAddress })

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
