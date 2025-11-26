import type { PeriodicDistributionsQueryPayload } from '../../../../graphql/subgraph/vault'
import { apiUrls, validateArgs } from '../../../../utils'
import graphql from '../../../../graphql'


export type GetPeriodicDistributionsInput = {
  vaultAddress: string
  endTimestamp: number
  startTimestamp: number
  options: StakeWise.Options
}

const getPeriodicDistributions = (values: GetPeriodicDistributionsInput) => {
  const { options, vaultAddress, startTimestamp, endTimestamp } = values

  validateArgs.address({ vaultAddress })
  validateArgs.number({ startTimestamp, endTimestamp })

  return graphql.subgraph.vault.fetchPeriodicDistributionsQuery({
    url: apiUrls.getSubgraphqlUrl(options),
    variables: {
      endTimestamp: String(endTimestamp),
      startTimestamp: String(startTimestamp),
      vaultAddress: vaultAddress.toLowerCase(),
    },
    modifyResult: (data: PeriodicDistributionsQueryPayload) => data?.periodicDistributions || [],
  })
}


export default getPeriodicDistributions
