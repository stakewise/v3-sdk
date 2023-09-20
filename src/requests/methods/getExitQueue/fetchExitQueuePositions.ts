import { subgraph } from 'graphql'


export type FetchExitQueuePositionsInput = {
  options: SDK.Options
  vaultAddress: string
  userAddress: string
}

const fetchExitQueuePositions = async (values: FetchExitQueuePositionsInput) => {
  const { options, vaultAddress, userAddress } = values
  const { network } = options

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
