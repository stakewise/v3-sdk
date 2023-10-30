import { AllocatorActionsQueryPayload } from '../../../../graphql/subgraph/allocatorActions'


type AllocatorActionsPayload = Pick<AllocatorActionsQueryPayload['allocatorActions'][number], 'id' | 'actionType' | 'assets'>

export type ModifiedStakerActions = Array<AllocatorActionsPayload & {
  link: string
  createdAt: number
}>
