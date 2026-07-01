import type * as z from 'zod/mini'

import type { SubVaultsQueryVariables } from '../../../../graphql/subgraph/vault'
import { apiUrls } from '../../../../helpers'
import graphql from '../../../../graphql'

import modifySubVaults from './modifySubVaults'
import { validate, validateSchema } from './validate'


export type GetSubVaultsInput = StakeWise.CommonParams & z.input<typeof validateSchema>

const getSubVaults = (input: GetSubVaultsInput) => {
  const { options, skip, limit } = input

  const { vaultAddress } = validate(input)

  const metaVaultId = vaultAddress

  return graphql.subgraph.vault.fetchSubVaultsQuery({
    url: apiUrls.getSubgraphqlUrl(options),
    variables: {
      skip,
      first: limit,
      where: { metaVault: metaVaultId } as SubVaultsQueryVariables['where'],
      metaVaultAddress: metaVaultId,
    },
    modifyResult: modifySubVaults,
  })
}


export default getSubVaults
