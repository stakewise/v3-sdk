import { apiUrls } from 'helpers'
import { subgraph } from 'graphql'
import { VaultQueryVariables, VaultQueryPayload } from 'graphql/subgraph/vault'

import { ModifiedVault } from './types'
import modifyVault from './modifyVault'


type GetVaultInput = {
  options: SDK.Options
  vaultAddress: VaultQueryVariables['address']
}

const getVault = async (input: GetVaultInput) => {
  const { vaultAddress, options } = input

  const data = await subgraph.vault.fetchVaultQuery<ModifiedVault>({
    url: apiUrls.getSubgraphqlUrl(options),
    variables: {
      address: vaultAddress.toLowerCase(),
    },
    modifyResult: (data: VaultQueryPayload) => modifyVault({ data, network: options.network }),
  })

  return data
}


export default getVault
