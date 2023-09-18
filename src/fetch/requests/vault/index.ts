import { Network } from 'helpers'
import { subgraph } from 'graphql'
import { VaultQueryVariables } from 'graphql/subgraph/vault'

import { ModifiedVault } from './types'
import modifyVault from './modifyVault'


type VaultInput = {
  network: Network
  address: VaultQueryVariables['address']
}

const vault = async (input: VaultInput) => {
  const { address, network } = input

  const data = await subgraph.vault.fetchVaultQuery<ModifiedVault>({
    network,
    variables: {
      address: address.toLowerCase(),
    },
    modifyResult: modifyVault,
  })

  return data
}


export default vault
