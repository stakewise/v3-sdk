import { describe, expect } from 'vitest'

import { it } from '.'
import mockGraphql, { calls, takeUnknownOperations, takeUnmockedRequests } from './mockGraphql'


type ValuePayload = { value: number }

const url = 'https://example.com'

const notGraphqlCases = [
  { name: 'plain body', body: 'plain text' },
  { name: 'no operation', body: JSON.stringify({ query: '{ vault { id } }' }) },
  { name: 'anonymous mutation', body: JSON.stringify({ query: 'mutation { upload }' }) },
  { name: 'name not at start', body: JSON.stringify({ query: '{ vault } # query Hidden' }) },
]

const requestOperation = (operationName: string, path = '') => fetch(`${url}${path}?${operationName}`, {
  method: 'POST',
  body: JSON.stringify({ operationName, variables: {} }),
})

describe('mockGraphql', () => {
  it('forgotten operation', async () => {
    mockGraphql<ValuePayload>({ name: 'Known', data: { value: 1 } })

    const response = await requestOperation('Forgotten')
    const body = await response.json()
    const unknownOperations = takeUnknownOperations()
    const drainedOperations = takeUnknownOperations()

    expect(body.errors[0].message).toContain('no payload for Forgotten')
    expect(calls).toMatchObject([ { operationName: 'Forgotten' } ])
    expect(unknownOperations).toEqual([ 'Forgotten' ])
    expect(drainedOperations).toEqual([])
  })

  it('unknown url', async () => {
    mockGraphql<ValuePayload>({ name: 'Rates', url: `${url}/first`, data: { value: 1 } })

    const response = await requestOperation('Rates', '/second')
    const body = await response.json()
    const unknownOperations = takeUnknownOperations()

    expect(body.errors[0].message).toContain('no payload for Rates')
    expect(unknownOperations).toEqual([ 'Rates' ])
  })

  it.for(notGraphqlCases)('$name', async ({ body }) => {
    const request = fetch(`${url}/rpc`, { method: 'POST', body })

    await expect(request).rejects.toThrow('fetch without mockGraphql')

    const unmockedRequests = takeUnmockedRequests()

    expect(unmockedRequests).toEqual([ `${url}/rpc` ])
  })
})
