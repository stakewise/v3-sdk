import { subgraph } from '../../graphql'
import { VaultQueryPayload, VaultQueryVariables } from '../../graphql/subgraph/vault'

import modifyVaultData from './modifyVaultData'
import { Output } from './types'


const fetchVault = async <T = Output>(props: ModuleGQL.FetchCodegenInput<VaultQueryPayload, VaultQueryVariables, T>) => {
  const { variables, modifyResult } = props

  const data = await subgraph.vault.fetchVaultQuery<Output>({
    variables: {
      address: variables.address.toLowerCase(),
    },
    modifyResult: modifyVaultData,
  })

  return typeof modifyResult === 'function' ? modifyResult(data) : data
}


export default fetchVault
