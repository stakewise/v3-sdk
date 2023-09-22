import { apiUrls } from 'helpers'
import { subgraph } from 'graphql'
import { TransactionsQueryVariables } from 'graphql/subgraph/transactions'


type GetTransactionsInput = {
  hash: string
  options: StakeWise.Options
}

const getTransactions = async (input: GetTransactionsInput) => {
  const { options, hash } = input

  const data = await subgraph.transactions.fetchTransactionsQuery({
    url: apiUrls.getSubgraphqlUrl(options),
    variables: {
      where: {
        id: hash,
      },
    } as TransactionsQueryVariables,
  })

  return data?.transactions || []
}


export default getTransactions
