import { subgraph } from 'graphql'
import { VaultQueryVariables, VaultQueryPayload } from 'graphql/subgraph/vault'

import { ModifiedVault } from './types'
import modifyVault from './modifyVault'


type VaultInput = {
  options: SDK.Options
  vaultAddress: VaultQueryVariables['address']
}

const vault = async (input: VaultInput) => {
  const { vaultAddress, options } = input
  const { network } = options

  const data = await subgraph.vault.fetchVaultQuery<ModifiedVault>({
    network,
    variables: {
      address: vaultAddress.toLowerCase(),
    },
    modifyResult: (data: VaultQueryPayload) => modifyVault({ data, network }),
  })

  return data
}


export default vault
