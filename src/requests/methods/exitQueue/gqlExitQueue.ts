import { Network } from 'helpers'
import { subgraph } from 'graphql'


export type GqlExitQueueInput = {
  vaultAddress: string
  userAddress: string
  network: Network
}

const gqlExitQueue = async (input: GqlExitQueueInput) => {
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


export default gqlExitQueue
