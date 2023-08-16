import { graphqlFetch } from '../../../modules/gql-module'
import constants from '../../../constants'


type SwiseStatsQueryVariables = BackendGraph.Exact<{ [key: string]: never; }>
type SwiseStatsQueryPayload = { swiseStats: { price: string } }


const query = 'query SwiseStats { swiseStats { price }}'


const fetchSwiseStatsQuery = <ModifiedData = SwiseStatsQueryPayload>(
  { variables, modifyResult }: ModuleGQL.FetchCodegenInput<SwiseStatsQueryPayload, SwiseStatsQueryVariables, ModifiedData>
) => (
  graphqlFetch<SwiseStatsQueryPayload, SwiseStatsQueryVariables, ModifiedData>({
    url: constants.url.backend,
    query,
    variables,
    modifyResult,
  })
)


export { fetchSwiseStatsQuery }
export type { SwiseStatsQueryPayload, SwiseStatsQueryVariables }
