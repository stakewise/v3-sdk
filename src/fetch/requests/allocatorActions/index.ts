import type { AllocatorActionsQueryVariables } from 'graphql/subgraph/allocatorActions'
import { Network, AllocatorActionType } from 'helpers'
import { subgraph } from 'graphql'

import { ModifiedAllocatorActions } from './types'
import modifyAllocatorActions from './modifyAllocatorActions'


type AllocatorActionsInput = {
  network: Network
  types: AllocatorActionType[]
  skip: AllocatorActionsQueryVariables['skip']
  limit: AllocatorActionsQueryVariables['first']
  vaultAddress: AllocatorActionsQueryVariables['where']['address']
}

const allocatorActions = async (input: AllocatorActionsInput) => {
  const { network, skip, limit, types, vaultAddress } = input

  const data = await subgraph.allocatorActions.fetchAllocatorActionsQuery<ModifiedAllocatorActions>({
    network,
    variables: {
      skip,
      first: limit,
      where: {
        actionType_in: types,
        vault_: { id: vaultAddress.toLowerCase() },
      } as AllocatorActionsQueryVariables['where'],
    },
    modifyResult: (data: any) => modifyAllocatorActions({ data, network }),
  })

  return data
}


export default allocatorActions
