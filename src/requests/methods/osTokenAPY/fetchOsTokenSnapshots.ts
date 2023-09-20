import { subgraph } from 'graphql'


export type FetchOsTokenSnapshotsInput = {
  options: SDK.Options
}

const fetchOsTokenSnapshots = async (input: FetchOsTokenSnapshotsInput) => {
  const { options: { network } } = input

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
