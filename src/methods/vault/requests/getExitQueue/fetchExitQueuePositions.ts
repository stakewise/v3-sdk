import { subgraph } from '../../../../graphql'
import { apiUrls } from '../../../../utils'


export type FetchExitQueuePositionsInput = {
  options: StakeWise.Options
  vaultAddress: string
  userAddress: string
}

const fetchExitQueuePositions = async (values: FetchExitQueuePositionsInput) => {
  const { options, vaultAddress, userAddress } = values

  const data = await subgraph.exitQueue.fetchExitQueueQuery({
    url: apiUrls.getSubgraphqlUrl(options),
    variables: {
      vault: vaultAddress.toLowerCase(),
      receiver: userAddress.toLowerCase(),
    },
  })

  return data?.exitRequests || []
}


export default fetchExitQueuePositions
