import type { AllocatorActionsQueryVariables, AllocatorActionsQueryPayload } from '../../../../graphql/subgraph/allocatorActions'
import { AllocatorActionType, apiUrls } from '../../../../helpers'
import modifyStakerActions from './modifyStakerActions'
import graphql from '../../../../graphql'

import { ModifiedStakerActions } from './types'
import { validate } from './validate'


export type GetStakerActionsInput = StakeWise.CommonParams & {
  userAddress?: string
  types?: AllocatorActionType[]
  skip: AllocatorActionsQueryVariables['skip']
  limit: AllocatorActionsQueryVariables['first']
  vaultAddress: AllocatorActionsQueryVariables['where']['address']
}

const getStakerActions = (input: GetStakerActionsInput) => {
  const { options, types } = input

  const { skip, limit, vaultAddress, userAddress } = validate(input)

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
        address: userAddress,
        vault_: { id: vaultAddress },
      } as AllocatorActionsQueryVariables['where'],
    },
    modifyResult: (data: AllocatorActionsQueryPayload) => modifyStakerActions({ data, network: options.network }),
  })
}


export default getStakerActions
