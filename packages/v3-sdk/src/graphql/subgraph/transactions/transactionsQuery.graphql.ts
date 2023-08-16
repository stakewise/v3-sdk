import { graphqlFetch } from '../../../modules/gql-module'
import constants from '../../../constants'


type TransactionsQueryVariables = SubgraphGraph.Exact<{
  where: SubgraphGraph.InputMaybe<SubgraphGraph.Transaction_Filter>
}>
type TransactionsQueryPayload = { transactions: Array<{ id: string }> }


const query = 'query Transactions( $where: Transaction_filter) { transactions(where: $where) { id }}'


const fetchTransactionsQuery = <ModifiedData = TransactionsQueryPayload>(
  { variables, modifyResult }: ModuleGQL.FetchCodegenInput<TransactionsQueryPayload, TransactionsQueryVariables, ModifiedData>
) => (
  graphqlFetch<TransactionsQueryPayload, TransactionsQueryVariables, ModifiedData>({
    url: constants.url.subgraph,
    query,
    variables,
    modifyResult,
  })
)


export { fetchTransactionsQuery }
export type { TransactionsQueryPayload, TransactionsQueryVariables }
