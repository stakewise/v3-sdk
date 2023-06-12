import { graphqlFetch } from '../../../modules/gql-module'


type SwiseStatsQueryVariables = BackendGraph.Exact<{ [key: string]: never; }>
type SwiseStatsQueryPayload = { swiseStats: { price: string } }


const query = 'query SwiseStats { swiseStats { price }}'


const fetchSwiseStatsQuery = <ModifiedData = SwiseStatsQueryPayload>(
  { url, variables, modifyResult }: ModuleGQL.FetchCodegenInput<SwiseStatsQueryPayload, SwiseStatsQueryVariables, ModifiedData>
) => (
  graphqlFetch<SwiseStatsQueryPayload, SwiseStatsQueryVariables, ModifiedData>({
    url,
    query,
    variables,
    modifyResult,
  })
)


export { fetchSwiseStatsQuery }
export type { SwiseStatsQueryPayload, SwiseStatsQueryVariables }

