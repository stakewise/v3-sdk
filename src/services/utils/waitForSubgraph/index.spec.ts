import { describe, expect, vi } from 'vitest'

import { it, subgraphUrl, transactionHash } from '../../../../test'

import type { WaitForSubgraphInput } from './index'
import type { TransactionsQueryPayload } from '../../../graphql/subgraph/transactions'


type Input = StakeWise.ExtractInput<WaitForSubgraphInput>

const attempts = 11
const urlsPerAttempt = 2

const indexed: TransactionsQueryPayload = { transactions: [ { id: transactionHash } ] }
const notIndexed: TransactionsQueryPayload = { transactions: [] }

const invalidCases = [
  {
    name: 'invalid hash',
    input: { hash: '0x123' },
    message: 'The "hash" argument must be a valid 32-byte hex hash (0x + 64 hex chars)',
  },
  {
    name: 'missing hash',
    input: {},
    message: 'The "hash" argument',
  },
]

describe('waitForSubgraph', () => {
  it.for(invalidCases)('$name', ({ input, message }, { sdk, graphql }) => {
    const waitForSubgraph = () => sdk.utils.waitForSubgraph(input as Input)

    expect(waitForSubgraph).toThrow(message)
    expect(graphql.calls).toHaveLength(0)
  })

  it('indexed', async ({ sdk, graphql }) => {
    graphql.mock<TransactionsQueryPayload>({ name: 'Transactions', data: indexed })

    const variables = { where: { id: transactionHash } }
    const call = { url: subgraphUrl, operationName: 'Transactions', variables }

    const result = await sdk.utils.waitForSubgraph({ hash: transactionHash })

    expect(result).toBeUndefined()
    expect(graphql.calls).toEqual([ expect.objectContaining(call) ])
  })

  it('polls', async ({ sdk, graphql, clock }) => {
    graphql.mock<TransactionsQueryPayload>({ name: 'Transactions', data: notIndexed })

    const onSuccess = vi.fn()
    const request = sdk.utils.waitForSubgraph({ hash: transactionHash })

    request.then(onSuccess)

    await clock.advanceTimersByTimeAsync(0)
    expect(graphql.calls).toHaveLength(1)

    await clock.advanceTimersByTimeAsync(999)
    expect(graphql.calls).toHaveLength(1)

    await clock.advanceTimersByTimeAsync(1)
    expect(graphql.calls).toHaveLength(2)

    graphql.mock<TransactionsQueryPayload>({ name: 'Transactions', data: indexed })

    await clock.advanceTimersByTimeAsync(999)
    expect(graphql.calls).toHaveLength(2)
    expect(onSuccess).not.toHaveBeenCalled()

    await clock.advanceTimersByTimeAsync(1)
    expect(graphql.calls).toHaveLength(3)
    expect(onSuccess).toHaveBeenCalledTimes(1)
  })

  it('retry', async ({ sdk, graphql, clock }) => {
    graphql.mockError({ name: 'Transactions', message: 'Subgraph is down' })

    const onSuccess = vi.fn()
    const request = sdk.utils.waitForSubgraph({ hash: transactionHash })

    request.then(onSuccess)

    await clock.advanceTimersByTimeAsync(0)
    expect(graphql.calls).toHaveLength(urlsPerAttempt)

    graphql.mock<TransactionsQueryPayload>({ name: 'Transactions', data: indexed })

    await clock.advanceTimersByTimeAsync(99)
    expect(graphql.calls).toHaveLength(urlsPerAttempt)
    expect(onSuccess).not.toHaveBeenCalled()

    await clock.advanceTimersByTimeAsync(1)
    expect(graphql.calls).toHaveLength(urlsPerAttempt + 1)
    expect(onSuccess).toHaveBeenCalledTimes(1)
  })

  it('retries exhausted', async ({ sdk, graphql, clock }) => {
    graphql.mockError({ name: 'Transactions', message: 'Subgraph is down' })

    const onSuccess = vi.fn()
    const onError = vi.fn()
    const request = sdk.utils.waitForSubgraph({ hash: transactionHash })

    request.then(onSuccess, onError)

    await clock.advanceTimersByTimeAsync(5499)
    expect(onError).not.toHaveBeenCalled()

    await clock.advanceTimersByTimeAsync(1)

    const failedCalls = attempts * urlsPerAttempt

    expect(onError).toHaveBeenCalledTimes(1)
    expect(onError).toHaveBeenCalledWith(expect.objectContaining({ message: 'Subgraph is down' }))
    expect(onSuccess).not.toHaveBeenCalled()
    expect(graphql.calls).toHaveLength(failedCalls)
  })

  it('abort', async ({ sdk, graphql, clock }) => {
    graphql.mock<TransactionsQueryPayload>({ name: 'Transactions', data: notIndexed })

    const onSuccess = vi.fn()
    const onError = vi.fn()
    const request = sdk.utils.waitForSubgraph({ hash: transactionHash })

    request.then(onSuccess, onError)

    await clock.advanceTimersByTimeAsync(0)
    request.abort()

    graphql.mock<TransactionsQueryPayload>({ name: 'Transactions', data: indexed })

    await clock.advanceTimersByTimeAsync(3000)

    expect(graphql.calls).toHaveLength(1)
    expect(onSuccess).not.toHaveBeenCalled()
    expect(onError).not.toHaveBeenCalled()
  })

  it('abort retry', async ({ sdk, graphql, clock }) => {
    graphql.mockError({ name: 'Transactions', message: 'Subgraph is down' })

    const onSuccess = vi.fn()
    const onError = vi.fn()
    const request = sdk.utils.waitForSubgraph({ hash: transactionHash })

    request.then(onSuccess, onError)

    await clock.advanceTimersByTimeAsync(0)
    request.abort()

    graphql.mock<TransactionsQueryPayload>({ name: 'Transactions', data: indexed })

    await clock.advanceTimersByTimeAsync(10000)

    expect(graphql.calls).toHaveLength(urlsPerAttempt)
    expect(onSuccess).not.toHaveBeenCalled()
    expect(onError).not.toHaveBeenCalled()
  })
})
