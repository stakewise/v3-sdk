import type * as z from 'zod/mini'

import { apiUrls } from '../../../../helpers'
import graphql from '../../../../graphql'

import modifyVaultStats from './modifyVaultStats'
import { validate, validateSchema } from './validate'


export type GetVaultStatsInput = StakeWise.CommonParams & z.input<typeof validateSchema>

const getVaultStats = (input: GetVaultStatsInput) => {
  const { options, daysCount } = input

  const { vaultAddress } = validate(input)

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
