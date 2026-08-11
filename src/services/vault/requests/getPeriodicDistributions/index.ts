import type * as z from 'zod/mini'

import type { PeriodicDistributionsQueryPayload } from '../../../../graphql/subgraph/vault'
import { apiUrls } from '../../../../helpers'
import graphql from '../../../../graphql'

import { validate, validateSchema } from './validate'


export type GetPeriodicDistributionsInput = StakeWise.CommonParams & z.input<typeof validateSchema>

const getPeriodicDistributions = (values: GetPeriodicDistributionsInput) => {
  const { options, startTimestamp, endTimestamp } = values

  const { vaultAddress } = validate(values)

  return graphql.subgraph.vault.fetchPeriodicDistributionsQuery({
    url: apiUrls.getSubgraphqlUrl(options),
    variables: {
      endTimestamp: String(endTimestamp),
      startTimestamp: String(startTimestamp),
      vaultAddress,
    },
    modifyResult: (data: PeriodicDistributionsQueryPayload) => data?.periodicDistributions || [],
  })
}


export default getPeriodicDistributions
