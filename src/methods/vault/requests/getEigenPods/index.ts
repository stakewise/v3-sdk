import type { EigenPodsQueryPayload, EigenPodsQueryVariables } from '../../../../graphql/subgraph/eigenPods'
import { apiUrls, validateArgs } from '../../../../utils'
import type { ModifiedEigenPods } from './types'
import modifyEigenPods from './modifyEigenPods'
import graphql from '../../../../graphql'


type GetEigenPodsInput = {
  options: StakeWise.Options
  vaultAddress: EigenPodsQueryVariables['where']['address']
  skip: EigenPodsQueryVariables['skip']
  limit: EigenPodsQueryVariables['first']
}

const getEigenPods = (input: GetEigenPodsInput) => {
  const { options, skip, limit, vaultAddress } = input

  validateArgs.address({ vaultAddress })
  validateArgs.number({ skip, limit })

  return graphql.subgraph.eigenPods.fetchEigenPodsQuery<ModifiedEigenPods>({
    url: apiUrls.getSubgraphqlUrl(options),
    variables: {
      skip,
      first: limit,
      where: {
        vault_: { id: vaultAddress.toLowerCase() },
      } as EigenPodsQueryVariables['where'],
    },
    modifyResult: (data: EigenPodsQueryPayload) => modifyEigenPods({ data, network: options.network }),
  })
}


export default getEigenPods
