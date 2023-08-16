import { graphqlFetch } from '../../../modules/gql-module'
import constants from '../../../constants'


type ExitQueueQueryVariables = SubgraphGraph.Exact<{
  owner: SubgraphGraph.InputMaybe<SubgraphGraph.Scalars['Bytes']['input']>
  vault: SubgraphGraph.Scalars['String']['input']
}>
type ExitQueueQueryPayload = { exitRequests: Array<{ positionTicket: string, totalShares: string }> }


const query = 'query exitQueue($owner: Bytes, $vault: String!) { exitRequests(where: { owner: $owner, vault: $vault, }) { positionTicket totalShares }}'


const fetchExitQueueQuery = <ModifiedData = ExitQueueQueryPayload>(
  { variables, modifyResult }: ModuleGQL.FetchCodegenInput<ExitQueueQueryPayload, ExitQueueQueryVariables, ModifiedData>
) => (
  graphqlFetch<ExitQueueQueryPayload, ExitQueueQueryVariables, ModifiedData>({
    url: constants.url.subgraph,
    query,
    variables,
    modifyResult,
  })
)


export { fetchExitQueueQuery }
export type { ExitQueueQueryPayload, ExitQueueQueryVariables }
