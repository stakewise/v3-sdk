import * as z from 'zod/mini'

import { apiUrls, schema, parseArgs } from '../../../../helpers'
import modifyVaultStats from './modifyVaultStats'
import graphql from '../../../../graphql'


const validateSchema = z.object({
  daysCount: schema.number,
  vaultAddress: schema.ethAddressLower,
})

export type GetVaultStatsInput = StakeWise.CommonParams & z.input<typeof validateSchema>

const getVaultStats = (input: GetVaultStatsInput) => {
  const { options, daysCount } = input

  const { vaultAddress } = parseArgs(validateSchema, input)

  return graphql.subgraph.vault.fetchVaultStatsQuery({
    url: apiUrls.getSubgraphqlUrl(options),
    variables: {
      vaultAddress,
      limit: daysCount,
    },
    modifyResult: modifyVaultStats,
  })
}


export default getVaultStats
