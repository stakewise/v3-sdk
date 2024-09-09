import type { VaultQueryVariables, VaultQueryPayload } from '../../../../graphql/subgraph/vault'
import { apiUrls, validateArgs } from '../../../../utils'
import graphql from '../../../../graphql'
import { ModifiedVault } from './types'
import modifyVault from './modifyVault'


type GetVaultInput = {
  options: StakeWise.Options
  vaultAddress: VaultQueryVariables['address']
}

const getVault = async (input: GetVaultInput) => {
  const { options, vaultAddress } = input

  validateArgs.address({ vaultAddress })

  return graphql.subgraph.vault.fetchVaultQuery<ModifiedVault>({
    url: apiUrls.getSubgraphqlUrl(options),
    variables: {
      address: vaultAddress.toLowerCase(),
    },
    modifyResult: (data: VaultQueryPayload) => modifyVault({ data, network: options.network }),
  })
}


export default getVault
