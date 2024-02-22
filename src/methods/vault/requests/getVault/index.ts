import type { VaultQueryVariables, VaultQueryPayload } from '../../../../graphql/subgraph/vault'
import { wrapAbortPromise } from '../../../../modules/gql-module'
import { apiUrls, validateArgs } from '../../../../utils'
import graphql from '../../../../graphql'
import { ModifiedVault } from './types'
import modifyVault from './modifyVault'


type GetVaultInput = {
  options: StakeWise.Options
  contracts: StakeWise.Contracts
  vaultAddress: VaultQueryVariables['address']
}

type GetVaultOutput = ModifiedVault & {
  isCollateralized: boolean
}

const getVault = async (input: GetVaultInput) => {
  const { contracts, options, vaultAddress } = input

  validateArgs.address({ vaultAddress })

  const [ data, isCollateralized ] = await Promise.all([
    graphql.subgraph.vault.fetchVaultQuery<ModifiedVault>({
      url: apiUrls.getSubgraphqlUrl(options),
      variables: {
        address: vaultAddress.toLowerCase(),
      },
      modifyResult: (data: VaultQueryPayload) => modifyVault({ data, network: options.network }),
    }),
    contracts.base.keeper.isCollateralized(vaultAddress),
  ])

  return {
    ...data,
    isCollateralized,
  }
}


export default wrapAbortPromise<GetVaultInput, GetVaultOutput>(getVault)
