import type { VaultStatsQueryVariables } from '../../../../graphql/subgraph/vault'
import modifyVaultStats from './modifyVaultStats'
import { apiUrls, validateArgs } from '../../../../utils'
import graphql from '../../../../graphql'


type GetVaultStatsInput = {
  options: StakeWise.Options
  vaultAddress: VaultStatsQueryVariables['vaultAddress']
  daysCount: number
}

const getVaultStats = (input: GetVaultStatsInput) => {
  const { options, vaultAddress, daysCount } = input

  validateArgs.address({ vaultAddress })
  validateArgs.number({ daysCount })

  return graphql.subgraph.vault.fetchVaultStatsQuery({
    url: apiUrls.getSubgraphqlUrl(options),
    variables: {
      daysCount,
      vaultAddress: vaultAddress.toLowerCase(),
    } as VaultStatsQueryVariables,
    modifyResult: modifyVaultStats,
  })
}


export default getVaultStats
