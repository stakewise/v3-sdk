import { apiUrls } from '../../../utils'
import graphql from '../../../graphql'


export type FetchOsTokenSnapshotsInput = {
  options: StakeWise.Options
}

const getOsTokenAPY = async (input: FetchOsTokenSnapshotsInput) => {
  const { options } = input

  const data = await graphql.subgraph.osToken.fetchOsTokenApyQuery({
    url: apiUrls.getSubgraphqlUrl(options),
  })

  return data?.osTokens?.[0].apy || '0'
}


export default getOsTokenAPY
