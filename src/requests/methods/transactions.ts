import { subgraph } from 'graphql'
import { TransactionsQueryVariables } from 'graphql/subgraph/transactions'


type TransactionsInput = {
  hash: string
  options: SDK.Options
}

const transactions = async (input: TransactionsInput) => {
  const { options, hash } = input

  const data = await subgraph.transactions.fetchTransactionsQuery({
    network: options.network,
    variables: {
      where: {
        id: hash,
      },
    } as TransactionsQueryVariables,
  })

  return data?.transactions || []
}


export default transactions
