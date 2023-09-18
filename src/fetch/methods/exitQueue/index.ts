import { Network } from 'helpers'
import { subgraph } from 'graphql'


type ExitQueueInput = {
  vaultAddress: string
  userAddress: string
  network: Network
}

const exitQueue = async (input: ExitQueueInput) => {
  const { network, vaultAddress, userAddress } = input

  const data = await subgraph.exitQueue.fetchExitQueueQuery({
    network,
    variables: {
      vault: vaultAddress.toLowerCase(),
      owner: userAddress.toLowerCase() || '',
    },
  })

  return data?.exitRequests || []
}


export default exitQueue
