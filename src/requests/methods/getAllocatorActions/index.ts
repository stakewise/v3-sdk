import type { AllocatorActionsQueryVariables, AllocatorActionsQueryPayload } from 'graphql/subgraph/allocatorActions'
import { AllocatorActionType } from 'helpers'
import { subgraph } from 'graphql'

import { ModifiedAllocatorActions } from './types'
import modifyAllocatorActions from './modifyAllocatorActions'


type GetAllocatorActionsInput = {
  options: SDK.Options
  userAddress?: string
  types: AllocatorActionType[]
  skip: AllocatorActionsQueryVariables['skip']
  limit: AllocatorActionsQueryVariables['first']
  vaultAddress: AllocatorActionsQueryVariables['where']['address']
}

const getAllocatorActions = async (input: GetAllocatorActionsInput) => {
  const { options, skip, limit, types, vaultAddress, userAddress } = input
  const { network } = options

  const data = await subgraph.allocatorActions.fetchAllocatorActionsQuery<ModifiedAllocatorActions>({
    network,
    variables: {
      skip,
      first: limit,
      where: {
        address: userAddress,
        actionType_in: types,
        vault_: { id: vaultAddress.toLowerCase() },
      } as AllocatorActionsQueryVariables['where'],
    },
    modifyResult: (data: AllocatorActionsQueryPayload) => modifyAllocatorActions({ data, network }),
  })

  return data
}


export default getAllocatorActions
