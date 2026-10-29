import type * as z from 'zod/mini'

import { apiUrls } from '../../../../helpers'
import graphql from '../../../../graphql'

import { validate, validateSchema } from './validate'


export type GetOsTokenConfigInput = StakeWise.CommonParams & z.input<typeof validateSchema>

const getOsTokenConfig = (input: GetOsTokenConfigInput) => {
  const { options } = input

  const { vaultAddress } = validate(input)

  return graphql.subgraph.vault.fetchVaultOsTokenConfigQuery({
    ...apiUrls.getSubgraphParams(options),
    variables: {
      address: vaultAddress,
    },
    modifyResult: (data) => {
      if (!data.vault) {
        throw new Error('Vault not found')
      }

      return data.vault.osTokenConfig
    },
  })
}


export default getOsTokenConfig
