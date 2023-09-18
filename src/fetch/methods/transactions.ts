import { Network } from 'helpers'
import { subgraph } from 'graphql'
import { TransactionsQueryVariables } from 'graphql/subgraph/transactions'


type TransactionsInput = {
  hash: string
  network: Network
}

const transactions = async (input: TransactionsInput) => {
  const { network, hash } = input

  const data = await subgraph.transactions.fetchTransactionsQuery({
    network,
    variables: {
      where: {
        id: hash,
      },
    } as TransactionsQueryVariables,
  })

  return data?.transactions || []
}


export default transactions
