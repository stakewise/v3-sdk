import type { AllocatorActionsQueryVariables, AllocatorActionsQueryPayload } from '../../../../graphql/subgraph/allocatorActions'
import { AllocatorActionType, apiUrls, validateArgs } from '../../../../utils'
import modifyStakerActions from './modifyStakerActions'
import { ModifiedStakerActions } from './types'
import graphql from '../../../../graphql'


export type GetStakerActionsInput = StakeWise.CommonParams & {
  userAddress?: string
  types?: AllocatorActionType[]
  skip: AllocatorActionsQueryVariables['skip']
  limit: AllocatorActionsQueryVariables['first']
  vaultAddress: AllocatorActionsQueryVariables['where']['address']
}

const getStakerActions = (input: GetStakerActionsInput) => {
  const { options, skip, limit, types, vaultAddress, userAddress } = input

  validateArgs.address({ vaultAddress })
  validateArgs.number({ skip, limit })

  if (userAddress) {
    validateArgs.address({ userAddress })
  }

  if (types) {
    if (!Array.isArray(types)) {
      throw new Error(`The "types" argument must be a array`)
    }

    types.forEach((value) => {
      if (value in AllocatorActionType) {
        return
      }

      throw new Error(`The "types" argument must contain enum AllocatorActionType values`)
    })
  }

  return graphql.subgraph.allocatorActions.fetchAllocatorActionsQuery<ModifiedStakerActions>({
    url: apiUrls.getSubgraphqlUrl(options),
    variables: {
      skip,
      first: limit,
      where: {
        actionType_in: types,
        vault_: { id: vaultAddress.toLowerCase() },
        address: userAddress ? userAddress.toLowerCase() : undefined,
      } as AllocatorActionsQueryVariables['where'],
    },
    modifyResult: (data: AllocatorActionsQueryPayload) => modifyStakerActions({ data, network: options.network }),
  })
}


export default getStakerActions
