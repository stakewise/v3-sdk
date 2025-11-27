import { apiUrls, validateArgs } from '../../../../utils'
import modifyVaultStats from './modifyVaultStats'
import graphql from '../../../../graphql'


export type GetVaultStatsInput = StakeWise.CommonParams & {
  vaultAddress: string
  daysCount: number
}

const getVaultStats = (input: GetVaultStatsInput) => {
  const { options, vaultAddress, daysCount } = input

  validateArgs.address({ vaultAddress })
  validateArgs.number({ daysCount })

  return graphql.subgraph.vault.fetchVaultStatsQuery({
    url: apiUrls.getSubgraphqlUrl(options),
    variables: {
      limit: daysCount,
      vaultAddress: vaultAddress.toLowerCase(),
    },
    modifyResult: modifyVaultStats,
  })
}


export default getVaultStats
