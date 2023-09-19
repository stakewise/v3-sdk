import { Network } from 'helpers'
import { subgraph } from 'graphql'


export type FetchExitQueuePositionsInput = {
  vaultAddress: string
  userAddress: string
  network: Network
}

const fetchExitQueuePositions = async (values: FetchExitQueuePositionsInput) => {
  const { network, vaultAddress, userAddress } = values

  const data = await subgraph.exitQueue.fetchExitQueueQuery({
    network,
    variables: {
      vault: vaultAddress.toLowerCase(),
      owner: userAddress.toLowerCase() || '',
    },
  })

  return data?.exitRequests || []
}


export default fetchExitQueuePositions
