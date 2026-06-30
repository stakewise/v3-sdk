import { apiUrls, parseArgs, baseInputSchema } from '../../../../helpers'
import graphql from '../../../../graphql'


export type GetUserApyInput = StakeWise.BaseInput

const getUserApy = (input: GetUserApyInput) => {
  const { options, vaultAddress, userAddress } = input

  parseArgs(baseInputSchema, input)

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
