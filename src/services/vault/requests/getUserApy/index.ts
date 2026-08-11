import graphql from '../../../../graphql'
import { apiUrls } from '../../../../helpers'

import { validate } from './validate'


export type GetUserApyInput = StakeWise.BaseInput

const getUserApy = (input: GetUserApyInput) => {
  const { options } = input

  const { vaultAddress, userAddress } = validate(input)

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
