import { apiUrls } from 'helpers'
import { subgraph } from 'graphql'


export type FetchOsTokenSnapshotsInput = {
  options: StakeWise.Options
}

const fetchOsTokenSnapshots = async (input: FetchOsTokenSnapshotsInput) => {
  const { options } = input

  const data = await subgraph.osTokenSnapshots.fetchOsTokenSnapshotsQuery({
    url: apiUrls.getSubgraphqlUrl(options),
    variables: {
      first: 14,
      orderBy: 'createdAt',
      orderDirection: 'desc',
    },
  })

  return data?.osTokenSnapshots || []
}


export default fetchOsTokenSnapshots
