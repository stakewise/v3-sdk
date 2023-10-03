import type { AllocatorActionsQueryVariables, AllocatorActionsQueryPayload } from 'graphql/subgraph/allocatorActions'
import { AllocatorActionType, apiUrls } from 'helpers'
import { subgraph } from 'graphql'

import { ModifiedAllocatorActions } from './types'
import modifyAllocatorActions from './modifyAllocatorActions'


type GetAllocatorActionsInput = {
  options: StakeWise.Options
  userAddress?: string
  types?: AllocatorActionType[]
  skip: AllocatorActionsQueryVariables['skip']
  limit: AllocatorActionsQueryVariables['first']
  vaultAddress: AllocatorActionsQueryVariables['where']['address']
}

const getAllocatorActions = async (input: GetAllocatorActionsInput) => {
  const { options, skip, limit, types, vaultAddress, userAddress } = input

  const data = await subgraph.allocatorActions.fetchAllocatorActionsQuery<ModifiedAllocatorActions>({
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
    modifyResult: (data: AllocatorActionsQueryPayload) => modifyAllocatorActions({ data, network: options.network }),
  })

  return data
}


export default getAllocatorActions
