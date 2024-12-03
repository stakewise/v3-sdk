import { apiUrls, validateArgs } from '../../../../utils'
import graphql from '../../../../graphql'
import { ModifiedVault } from './types'
import modifyVault from './modifyVault'


type GetVaultInput = {
  options: StakeWise.Options
  vaultAddress: string
}

const getVault = (input: GetVaultInput) => {
  const { options, vaultAddress } = input

  validateArgs.address({ vaultAddress })

  return graphql.subgraph.vault.fetchVaultQuery<ModifiedVault>({
    url: apiUrls.getSubgraphqlUrl(options),
    variables: {
      address: vaultAddress.toLowerCase(),
    },
    modifyResult: (data) => modifyVault({ data, network: options.network }),
  })
}


export default getVault
