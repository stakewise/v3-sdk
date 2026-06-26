import * as z from 'zod/mini'

import { apiUrls, schema, parseArgs } from '../../../../helpers'
import graphql from '../../../../graphql'


const validateSchema = z.object({
  vaultAddress: schema.ethAddressLower,
})

export type GetOsTokenConfigInput = StakeWise.CommonParams & z.input<typeof validateSchema>

const getOsTokenConfig = (input: GetOsTokenConfigInput) => {
  const { options } = input

  const { vaultAddress } = parseArgs(validateSchema, input)

  return graphql.subgraph.vault.fetchVaultOsTokenConfigQuery({
    url: apiUrls.getSubgraphqlUrl(options),
    variables: {
      address: vaultAddress,
    },
    modifyResult: (data) => data.vault.osTokenConfig,
  })
}


export default getOsTokenConfig
