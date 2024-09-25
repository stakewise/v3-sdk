import graphql from '../../../../graphql'
import { apiUrls } from '../../../../utils'


export type FetchExitQueuePositionsInput = {
  options: StakeWise.Options
  vaultAddress: string
  userAddress: string
  isClaimed?: boolean
}

const fetchExitQueuePositions = (values: FetchExitQueuePositionsInput) => {
  const { options, vaultAddress, userAddress, isClaimed = false } = values

  return graphql.subgraph.exitQueue.fetchExitQueueQuery({
    url: apiUrls.getSubgraphqlUrl(options),
    variables: {
      vault: vaultAddress.toLowerCase(),
      receiver: userAddress.toLowerCase(),
      isClaimed,
    },
    modifyResult: (data) => data?.exitRequests || [],
  })
}


export default fetchExitQueuePositions
