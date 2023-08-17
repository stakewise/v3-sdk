import { AllocatorActionsQueryPayload, AllocatorActionsQueryVariables } from '../../graphql/subgraph/allocatorActions'


type AllocatorAction = AllocatorActionsQueryPayload['allocatorActions'][number]

type ModifiedAllocatorAction = {
  link: string
  assets: AllocatorAction['assets']
  actionType: AllocatorAction['actionType']
  createdAt: AllocatorAction['createdAt']
}

export type Variables = AllocatorActionsQueryVariables

export type Input = AllocatorActionsQueryPayload

export type Output = ModifiedAllocatorAction[]
