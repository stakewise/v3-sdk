import { graphqlFetch } from '../../../modules/gql-module'


type ExitQueueQueryVariables = SubgraphGraph.Exact<{
  owner: SubgraphGraph.InputMaybe<SubgraphGraph.Scalars['Bytes']>
  vault: SubgraphGraph.Scalars['String']
}>
type ExitQueueQueryPayload = { exitRequests: Array<{ positionTicket: string, totalShares: string }> }


const query = 'query exitQueue($owner: Bytes, $vault: String!) { exitRequests(where: { owner: $owner, vault: $vault, }) { positionTicket totalShares }}'


const fetchExitQueueQuery = <ModifiedData = ExitQueueQueryPayload>(
  { url, variables, modifyResult }: ModuleGQL.FetchCodegenInput<ExitQueueQueryPayload, ExitQueueQueryVariables, ModifiedData>
) => (
  graphqlFetch<ExitQueueQueryPayload, ExitQueueQueryVariables, ModifiedData>({
    url,
    query,
    variables,
    modifyResult,
  })
)


export { fetchExitQueueQuery }
export type { ExitQueueQueryPayload, ExitQueueQueryVariables }

