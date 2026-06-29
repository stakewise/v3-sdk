import * as z from 'zod/mini'

import type { TransactionsQueryVariables } from '../../../graphql/subgraph/transactions'
import { apiUrls, schema, parseArgs } from '../../../helpers'
import graphql from '../../../graphql'


const getTransactionsSchema = z.object({
  hash: schema.string,
})

export type GetTransactionsInput = StakeWise.CommonParams & z.input<typeof getTransactionsSchema>

export const getTransactions = (input: GetTransactionsInput) => {
  const { options, hash } = input

  parseArgs(getTransactionsSchema, input)

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
