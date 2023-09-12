import { subgraph } from 'graphql'
import { VaultQueryVariables } from 'graphql/subgraph/vault'

import { ModifiedVault } from './types'
import modifyVaultData from './modifyVaultData'


type Input = {
  variables: VaultQueryVariables
}

const fetchVault = async (input: Input) => {
  const { variables } = input

  const data = await subgraph.vault.fetchVaultQuery<ModifiedVault>({
    variables: {
      address: variables.address.toLowerCase(),
    },
    modifyResult: modifyVaultData,
  })

  return data
}


export default fetchVault
