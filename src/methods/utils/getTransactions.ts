import type { TransactionsQueryVariables } from '../../graphql/subgraph/transactions'
import { apiUrls, validateArgs } from '../../utils'
import graphql from '../../graphql'


type GetTransactionsInput = {
  hash: string
  options: StakeWise.Options
}

const getTransactions = (input: GetTransactionsInput) => {
  const { options, hash } = input

  validateArgs.string({ hash })

  return graphql.subgraph.transactions.fetchTransactionsQuery({
    url: apiUrls.getSubgraphqlUrl(options),
    variables: {
      where: {
        id: hash,
      },
    } as TransactionsQueryVariables,
    modifyResult: (data) => data?.transactions || [],
  })
}


export default getTransactions
