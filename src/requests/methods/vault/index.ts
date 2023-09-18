import { Network } from 'helpers'
import { subgraph } from 'graphql'
import { VaultQueryVariables, VaultQueryPayload } from 'graphql/subgraph/vault'

import { ModifiedVault } from './types'
import modifyVault from './modifyVault'


type VaultInput = {
  network: Network
  vaultAddress: VaultQueryVariables['address']
}

const vault = async (input: VaultInput) => {
  const { vaultAddress, network } = input

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