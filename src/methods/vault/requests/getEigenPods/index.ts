import type { EigenPodsQueryPayload, EigenPodsQueryVariables } from '../../../../graphql/subgraph/eigenPods'
import { apiUrls, validateArgs } from '../../../../utils'
import type { ModifiedEigenPods } from './types'
import modifyEigenPods from './modifyEigenPods'
import graphql from '../../../../graphql'


type GetEigenPodsInput = {
  options: StakeWise.Options
  vaultAddress: EigenPodsQueryVariables['where']['address']
  skip?: EigenPodsQueryVariables['skip']
  limit?: EigenPodsQueryVariables['first']
}

const getEigenPods = (input: GetEigenPodsInput) => {
  const { options, skip, limit, vaultAddress } = input

  validateArgs.address({ vaultAddress })

  if (typeof skip !== 'undefined') {
    validateArgs.number({ skip })
  }

  if (typeof limit !== 'undefined') {
    validateArgs.number({ limit })
  }

  return graphql.subgraph.eigenPods.fetchEigenPodsQuery<ModifiedEigenPods>({
    url: apiUrls.getSubgraphqlUrl(options),
    variables: {
      skip: skip || 0,
      first: limit || 100,
      where: {
        vault_: { id: vaultAddress.toLowerCase() },
      } as EigenPodsQueryVariables['where'],
    },
    modifyResult: (data: EigenPodsQueryPayload) => modifyEigenPods({ data, network: options.network }),
  })
}


export default getEigenPods
