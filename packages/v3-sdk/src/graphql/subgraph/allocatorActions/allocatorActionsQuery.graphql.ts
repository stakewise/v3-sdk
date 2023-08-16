import { graphqlFetch } from '../../../modules/gql-module'
import constants from '../../../constants'


type AllocatorActionsQueryVariables = SubgraphGraph.Exact<{
  skip: SubgraphGraph.Scalars['Int']['input']
  first: SubgraphGraph.Scalars['Int']['input']
  where: SubgraphGraph.InputMaybe<SubgraphGraph.AllocatorAction_Filter>
}>
type AllocatorActionsQueryPayload = { allocatorActions: Array<{ id: string, assets: string, createdAt: string, actionType: SubgraphGraph.AllocatorActionType }> }


const query = 'query AllocatorActions( $skip: Int! $first: Int! $where: AllocatorAction_filter) { allocatorActions( skip: $skip, first: $first, orderBy: createdAt, orderDirection: desc, where: $where, ) { id assets createdAt actionType }}'


const fetchAllocatorActionsQuery = <ModifiedData = AllocatorActionsQueryPayload>(
  { variables, modifyResult }: ModuleGQL.FetchCodegenInput<AllocatorActionsQueryPayload, AllocatorActionsQueryVariables, ModifiedData>
) => (
  graphqlFetch<AllocatorActionsQueryPayload, AllocatorActionsQueryVariables, ModifiedData>({
    url: constants.url.subgraph,
    query,
    variables,
    modifyResult,
  })
)


export { fetchAllocatorActionsQuery }
export type { AllocatorActionsQueryPayload, AllocatorActionsQueryVariables }
