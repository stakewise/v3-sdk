import { apiUrls, getTimestamp, validateArgs } from '../../../../utils'
import modifyVaultStats from './modifyVaultStats'
import graphql from '../../../../graphql'


type GetVaultStatsInput = {
  options: StakeWise.Options
  vaultAddress: string
  daysCount: number
}

const getVaultStats = (input: GetVaultStatsInput) => {
  const { options, vaultAddress, daysCount } = input

  validateArgs.address({ vaultAddress })
  validateArgs.number({ daysCount })

  const timestamp = String(getTimestamp(daysCount))

  return graphql.subgraph.vault.fetchVaultStatsQuery({
    url: apiUrls.getSubgraphqlUrl(options),
    variables: {
      timestamp,
      vaultAddress: vaultAddress.toLowerCase(),
    },
    modifyResult: modifyVaultStats,
  })
}


export default getVaultStats
