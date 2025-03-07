import type { PeriodicDistributionsQueryPayload } from '../../../../graphql/subgraph/vault'
import { apiUrls, validateArgs } from '../../../../utils'
import graphql from '../../../../graphql'

import modifyPeriodicDistributions from './modifyPeriodicDistributions'


type GetPeriodicDistributionsInput = {
  vaultAddress: string
  endTimestamp: string
  startTimestamp: string
  options: StakeWise.Options
}

const getPeriodicDistributions = (values: GetPeriodicDistributionsInput) => {
  const { options, vaultAddress, startTimestamp, endTimestamp } = values

  validateArgs.address({ vaultAddress })
  validateArgs.string({ startTimestamp, endTimestamp })

  return graphql.subgraph.vault.fetchPeriodicDistributionsQuery({
    url: apiUrls.getSubgraphqlUrl(options),
    variables: {
      endTimestamp,
      startTimestamp,
      vaultAddress: vaultAddress.toLowerCase(),
    },
    modifyResult: (data: PeriodicDistributionsQueryPayload) => modifyPeriodicDistributions({ data }),
  })
}


export default getPeriodicDistributions
