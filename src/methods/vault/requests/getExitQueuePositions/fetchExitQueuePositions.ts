import graphql from '../../../../graphql'
import { apiUrls } from '../../../../utils'


export type FetchExitQueuePositionsInput = {
  options: StakeWise.Options
  vaultAddress: string
  userAddress: string
}

const fetchExitQueuePositions = (values: FetchExitQueuePositionsInput) => {
  const { options, vaultAddress, userAddress } = values

  return graphql.subgraph.exitQueue.fetchExitQueueQuery({
    url: apiUrls.getSubgraphqlUrl(options),
    variables: {
      vault: vaultAddress.toLowerCase(),
      receiver: userAddress.toLowerCase(),
    },
    modifyResult: (data) => data?.exitRequests || [],
  })
}


export default fetchExitQueuePositions
