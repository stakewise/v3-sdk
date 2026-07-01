import type * as z from 'zod/mini'

import type { TransactionsQueryVariables } from '../../../graphql/subgraph/transactions'
import { apiUrls } from '../../../helpers'
import graphql from '../../../graphql'

import { validate, validateSchema } from './validate'


export type GetTransactionsInput = StakeWise.CommonParams & z.input<typeof validateSchema>

export const getTransactions = (input: GetTransactionsInput) => {
  const { options } = input

  const { hash } = validate(input)

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
