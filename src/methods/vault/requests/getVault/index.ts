import { VaultQueryVariables, VaultQueryPayload } from '../../../../graphql/subgraph/vault'
import { apiUrls, validateArgs } from '../../../../utils'
import { subgraph } from '../../../../graphql'
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

const getVault = async (input: GetVaultInput): Promise<GetVaultOutput> => {
  const { contracts, options, vaultAddress } = input

  validateArgs.address({ vaultAddress })

  const data = await subgraph.vault.fetchVaultQuery<ModifiedVault>({
    url: apiUrls.getSubgraphqlUrl(options),
    variables: {
      address: vaultAddress.toLowerCase(),
    },
    modifyResult: (data: VaultQueryPayload) => modifyVault({ data, network: options.network }),
  })

  const isCollateralized = await contracts.base.keeper.isCollateralized(vaultAddress)

  return {
    ...data,
    isCollateralized,
  }
}


export default getVault
