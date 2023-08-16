import { graphqlFetch } from '../../../modules/gql-module'
import constants from '../../../constants'


type OsTokenSnapshotsQueryVariables = SubgraphGraph.Exact<{
  first: SubgraphGraph.InputMaybe<SubgraphGraph.Scalars['Int']['input']>
  orderBy: SubgraphGraph.InputMaybe<SubgraphGraph.OsTokenSnapshot_OrderBy>
  orderDirection: SubgraphGraph.InputMaybe<SubgraphGraph.OrderDirection>
}>
type OsTokenSnapshotsQueryPayload = { osTokenSnapshots: Array<{ avgRewardPerSecond: string }> }


const query = 'query osTokenSnapshots($first: Int, $orderBy: OsTokenSnapshot_orderBy, $orderDirection: OrderDirection) { osTokenSnapshots(first: $first, orderBy: $orderBy, orderDirection: $orderDirection) { avgRewardPerSecond }}'


const fetchOsTokenSnapshotsQuery = <ModifiedData = OsTokenSnapshotsQueryPayload>(
  { variables, modifyResult }: ModuleGQL.FetchCodegenInput<OsTokenSnapshotsQueryPayload, OsTokenSnapshotsQueryVariables, ModifiedData>
) => (
  graphqlFetch<OsTokenSnapshotsQueryPayload, OsTokenSnapshotsQueryVariables, ModifiedData>({
    url: constants.url.subgraph,
    query,
    variables,
    modifyResult,
  })
)


export { fetchOsTokenSnapshotsQuery }
export type { OsTokenSnapshotsQueryPayload, OsTokenSnapshotsQueryVariables }
