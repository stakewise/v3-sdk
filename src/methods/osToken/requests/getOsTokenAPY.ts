import { apiUrls } from '../../../utils'
import graphql from '../../../graphql'


export type FetchOsTokenSnapshotsInput = {
  options: StakeWise.Options
}

const getOsTokenAPY = (input: FetchOsTokenSnapshotsInput) => {
  const { options } = input

  return graphql.subgraph.osToken.fetchOsTokenApyQuery({
    url: apiUrls.getSubgraphqlUrl(options),
    modifyResult: (data) => data?.osTokens?.[0].apy || '0',
  })
}


export default getOsTokenAPY
