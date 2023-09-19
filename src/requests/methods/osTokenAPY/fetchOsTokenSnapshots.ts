import { Network } from 'helpers'
import { subgraph } from 'graphql'


export type FetchOsTokenSnapshotsInput = {
  network: Network
}

const fetchOsTokenSnapshots = async (values: FetchOsTokenSnapshotsInput) => {
  const { network } = values

  const data = await subgraph.osTokenSnapshots.fetchOsTokenSnapshotsQuery({
    network,
    variables: {
      first: 14,
      orderBy: 'createdAt',
      orderDirection: 'desc',
    },
  })

  return data?.osTokenSnapshots || []
}


export default fetchOsTokenSnapshots
