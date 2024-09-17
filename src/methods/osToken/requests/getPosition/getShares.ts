import graphql from '../../../../graphql'
import { apiUrls } from '../../../../utils'


type GetOsTokenPositionSharesInput = {
  userAddress: string
  vaultAddress: string
  options: StakeWise.Options
}

const getShares = (values: GetOsTokenPositionSharesInput) => {
  const { options, vaultAddress, userAddress } = values

  return graphql.subgraph.osToken.fetchOsTokenPositionsQuery({
    url: apiUrls.getSubgraphqlUrl(options),
    variables: {
      vaultAddress,
      address: userAddress,
    },
    modifyResult: (data) => BigInt(data?.osTokenPositions?.[0]?.shares || 0),
  })
}


export default getShares
