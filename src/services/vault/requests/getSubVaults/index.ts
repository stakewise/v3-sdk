import type { SubVaultsQueryVariables, SubVaultsQueryPayload } from '../../../../graphql/subgraph/vault'
import { apiUrls, validateArgs } from '../../../../helpers'
import graphql from '../../../../graphql'

import modifySubVaults from './modifySubVaults'


export type GetSubVaultsInput = StakeWise.CommonParams & {
  vaultAddress: string
  skip: SubVaultsQueryVariables['skip']
  limit: SubVaultsQueryVariables['first']
}

const getSubVaults = (input: GetSubVaultsInput) => {
  const { options, vaultAddress, skip, limit } = input

  validateArgs.address({ vaultAddress })
  validateArgs.number({ skip, limit })

  const metaVaultId = vaultAddress.toLowerCase()

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
