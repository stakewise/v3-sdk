import * as z from 'zod/mini'

import { apiUrls, schema, parseArgs } from '../../../../helpers'
import graphql from '../../../../graphql'


const validateSchema = z.object({
  vaultAddress: schema.ethAddressLower,
  userAddress: schema.ethAddressLower,
})

export type GetUserApyInput = StakeWise.CommonParams & z.input<typeof validateSchema>

const getUserApy = (input: GetUserApyInput) => {
  const { options } = input

  const { vaultAddress, userAddress } = parseArgs(validateSchema, input)

  return graphql.subgraph.vault.fetchUserApyQuery({
    url: apiUrls.getSubgraphqlUrl(options),
    variables: {
      userAddress,
      vaultAddress,
    },
    modifyResult: (data) => Number(data.allocators[0]?.apy || 0),
  })
}


export default getUserApy
