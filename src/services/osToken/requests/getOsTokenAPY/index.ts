import { apiUrls } from '../../../../utils'
import graphql from '../../../../graphql'


const getOsTokenAPY = (input: StakeWise.CommonParams) => {
  const { options } = input

  return graphql.subgraph.osToken.fetchOsTokenApyQuery({
    url: apiUrls.getSubgraphqlUrl(options),
    modifyResult: (data) => ({
      apy: data?.osTokens?.[0]?.apy || '0',
      feePercent: data?.osTokens?.[0]?.feePercent || 0,
    }),
  })
}


export default getOsTokenAPY
