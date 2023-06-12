import { graphqlFetch } from '../../../modules/gql-module'


type TransactionsQueryVariables = SubgraphGraph.Exact<{
  where: SubgraphGraph.InputMaybe<SubgraphGraph.Transaction_Filter>
}>
type TransactionsQueryPayload = { transactions: Array<{ id: string }> }


const query = 'query Transactions( $where: Transaction_filter) { transactions(where: $where) { id }}'


const fetchTransactionsQuery = <ModifiedData = TransactionsQueryPayload>(
  { url, variables, modifyResult }: ModuleGQL.FetchCodegenInput<TransactionsQueryPayload, TransactionsQueryVariables, ModifiedData>
) => (
  graphqlFetch<TransactionsQueryPayload, TransactionsQueryVariables, ModifiedData>({
    url,
    query,
    variables,
    modifyResult,
  })
)


export { fetchTransactionsQuery }
export type { TransactionsQueryPayload, TransactionsQueryVariables }

