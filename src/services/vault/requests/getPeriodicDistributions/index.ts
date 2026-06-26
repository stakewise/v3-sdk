import * as z from 'zod/mini'

import type { PeriodicDistributionsQueryPayload } from '../../../../graphql/subgraph/vault'
import { apiUrls, schema, parseArgs } from '../../../../helpers'
import graphql from '../../../../graphql'


const validateSchema = z.object({
  endTimestamp: schema.number,
  startTimestamp: schema.number,
  vaultAddress: schema.ethAddressLower,
})

export type GetPeriodicDistributionsInput = StakeWise.CommonParams & z.input<typeof validateSchema>

const getPeriodicDistributions = (values: GetPeriodicDistributionsInput) => {
  const { options, startTimestamp, endTimestamp } = values

  const { vaultAddress } = parseArgs(validateSchema, values)

  return graphql.subgraph.vault.fetchPeriodicDistributionsQuery({
    url: apiUrls.getSubgraphqlUrl(options),
    variables: {
      vaultAddress,
      endTimestamp: String(endTimestamp),
      startTimestamp: String(startTimestamp),
    },
    modifyResult: (data: PeriodicDistributionsQueryPayload) => data?.periodicDistributions || [],
  })
}


export default getPeriodicDistributions
