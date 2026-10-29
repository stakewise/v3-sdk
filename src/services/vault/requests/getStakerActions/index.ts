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
  const { options } = input

  const { skip, limit, types, vaultAddress, userAddress } = validate(input)

  return graphql.subgraph.allocatorActions.fetchAllocatorActionsQuery<ModifiedStakerActions>({
    ...apiUrls.getSubgraphParams(options),
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
