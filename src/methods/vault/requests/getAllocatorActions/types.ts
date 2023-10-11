import { AllocatorActionsQueryPayload } from '../../../../graphql/subgraph/allocatorActions'


type AllocatorActionsPayload = Pick<AllocatorActionsQueryPayload['allocatorActions'][number], 'id' | 'actionType' | 'assets'>

export type ModifiedAllocatorActions = Array<AllocatorActionsPayload & {
  link: string
  createdAt: number
}>
