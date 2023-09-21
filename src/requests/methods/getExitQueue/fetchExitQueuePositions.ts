import { apiUrls } from 'helpers'
import { subgraph } from 'graphql'


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
      owner: userAddress.toLowerCase() || '',
    },
  })

  return data?.exitRequests || []
}


export default fetchExitQueuePositions
