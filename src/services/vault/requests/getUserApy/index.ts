import { apiUrls, validateArgs } from '../../../../utils'
import graphql from '../../../../graphql'


export type GetUserApyInput = {
  options: StakeWise.Options
  vaultAddress: string
  userAddress: string
}

const getUserApy = (input: GetUserApyInput) => {
  const { options, vaultAddress, userAddress } = input

  validateArgs.address({ vaultAddress })

  return graphql.subgraph.vault.fetchUserApyQuery({
    url: apiUrls.getSubgraphqlUrl(options),
    variables: {
      userAddress: userAddress.toLowerCase(),
      vaultAddress: vaultAddress.toLowerCase(),
    },
    modifyResult: (data) => Number(data.allocators[0]?.apy || 0),
  })
}


export default getUserApy
