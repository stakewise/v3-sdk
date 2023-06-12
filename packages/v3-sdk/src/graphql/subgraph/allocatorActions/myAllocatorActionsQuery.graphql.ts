import { graphqlFetch } from '../../../modules/gql-module'


type MyAllocatorActionsQueryVariables = SubgraphGraph.Exact<{
  where: SubgraphGraph.InputMaybe<SubgraphGraph.AllocatorAction_Filter>
}>
type MyAllocatorActionsQueryPayload = { allocatorActions: Array<{ id: string }> }


const query = 'query MyAllocatorActions( $where: AllocatorAction_filter) { allocatorActions( first: 1, orderBy: createdAt, orderDirection: desc, where: $where, ) { id }}'


const fetchMyAllocatorActionsQuery = <ModifiedData = MyAllocatorActionsQueryPayload>(
  { url, variables, modifyResult }: ModuleGQL.FetchCodegenInput<MyAllocatorActionsQueryPayload, MyAllocatorActionsQueryVariables, ModifiedData>
) => (
  graphqlFetch<MyAllocatorActionsQueryPayload, MyAllocatorActionsQueryVariables, ModifiedData>({
    url,
    query,
    variables,
    modifyResult,
  })
)


export { fetchMyAllocatorActionsQuery }
export type { MyAllocatorActionsQueryPayload, MyAllocatorActionsQueryVariables }

