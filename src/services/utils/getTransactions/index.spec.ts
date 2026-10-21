import { describe, expect } from 'vitest'

import { it, subgraphUrl, transactionHash, gnosisSubgraphUrl } from '../../../../test'

import type { GetTransactionsInput } from './index'
import type { TransactionsQueryPayload } from '../../../graphql/subgraph/transactions'


type Input = StakeWise.ExtractInput<GetTransactionsInput>
type Payload = Partial<TransactionsQueryPayload>

const upperCaseHash = '0x000003F42FC31D56B31D2BC3C800EA3C4A7D7C09C80CA9AB90114BA337A2031F'

const resultCases = [
  {
    name: 'gnosis url',
    isGnosis: true,
    url: gnosisSubgraphUrl,
    data: { transactions: [ { id: transactionHash } ] },
    expected: [ { id: transactionHash } ],
  },
  {
    name: 'upper case hash',
    hash: upperCaseHash,
    url: subgraphUrl,
    data: { transactions: [ { id: transactionHash } ] },
    expected: [ { id: transactionHash } ],
  },
  {
    name: 'no transactions',
    url: subgraphUrl,
    data: { transactions: [] },
    expected: [],
  },
  {
    name: 'no field',
    url: subgraphUrl,
    data: {},
    expected: [],
  },
]

const invalidCases = [
  {
    name: 'missing hash',
    input: {},
    message: 'The "hash" argument',
  },
  {
    name: 'invalid hash',
    input: { hash: 1 },
    message: 'The "hash" argument must be a string',
  },
]

describe('getTransactions', () => {
  it.for(resultCases)('$name', async (resultCase, { sdk, graphql, gnosisSdk }) => {
    const {
      url,
      data,
      expected,
      isGnosis,
      hash = transactionHash,
    } = resultCase

    graphql.mock<Payload>({ name: 'Transactions', data })

    const transactionsSdk = isGnosis ? gnosisSdk : sdk
    const call = { url, operationName: 'Transactions', variables: { where: { id: transactionHash } } }

    const result = await transactionsSdk.utils.getTransactions({ hash })

    expect(result).toEqual(expected)
    expect(graphql.calls).toEqual([ expect.objectContaining(call) ])
  })

  it.for(invalidCases)('$name', ({ input, message }, { sdk, graphql }) => {
    const getTransactions = () => sdk.utils.getTransactions(input as unknown as Input)

    expect(getTransactions).toThrow(message)
    expect(graphql.calls).toHaveLength(0)
  })
})
