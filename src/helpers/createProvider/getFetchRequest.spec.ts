import { describe, expect } from 'vitest'
import { FetchResponse } from 'ethers'

import { rpcUrl, it as baseIt } from '../../../test'

import getFetchRequest from './getFetchRequest'


const requestCases = [
  {
    name: 'url',
    input: rpcUrl,
    apiKey: undefined,
    authorization: undefined,
  },
  {
    name: 'url with headers',
    input: { url: rpcUrl, headers: { 'X-Api-Key': 'test-key', Authorization: 'Bearer test' } },
    apiKey: 'test-key',
    authorization: 'Bearer test',
  },
]

type RetryCase = {
  name: string
  status: number
  headers: Record<string, string>
  shouldRetry: boolean
  delay: number
}

const retryCases: RetryCase[] = [
  {
    name: 'Retry-After zero',
    status: 429,
    headers: { 'Retry-After': '0' },
    shouldRetry: false,
    delay: 10_000,
  },
  {
    name: 'Retry-After date',
    status: 429,
    headers: { 'Retry-After': 'Wed, 21 Oct 2015 07:28:00 GMT' },
    shouldRetry: false,
    delay: 10_000,
  },
  {
    name: 'other status',
    status: 500,
    headers: {},
    shouldRetry: true,
    delay: 0,
  },
]

const respond = (statusCode: number, headers: Record<string, string> = {}) => (
  new FetchResponse(statusCode, 'status', headers, null)
)

const it = baseIt.extend('fetchRequest', ({ clock }) => {
  const request = getFetchRequest(rpcUrl)
  const { preflightFunc, processFunc, retryFunc } = request

  const waited = async (preflight: () => Promise<unknown>) => {
    const startedAt = Date.now()
    const pending = preflight()

    await clock.runAllTimersAsync()
    await pending

    return Date.now() - startedAt
  }

  return {
    request,
    waited,
    preflight: () => preflightFunc!(request),
    process: (response: FetchResponse) => processFunc!(request, response),
    retry: (response: FetchResponse) => retryFunc!(request, response, 1),
  }
})

describe('getFetchRequest', () => {

  it.for(requestCases)('$name', ({ input, apiKey, authorization }) => {
    const request = getFetchRequest(input)
    const apiKeyHeader = request.getHeader('x-api-key')
    const authorizationHeader = request.getHeader('authorization')

    expect(request.url).toBe(rpcUrl)
    expect(apiKeyHeader).toBe(apiKey)
    expect(authorizationHeader).toBe(authorization)
  })

  it('no throttle', async ({ fetchRequest }) => {
    const { request, preflight, waited } = fetchRequest

    const result = await preflight()
    const delay = await waited(preflight)

    expect(result).toBe(request)
    expect(delay).toBe(0)
  })

  it.for(retryCases)('$name', async ({ status, headers, shouldRetry, delay }, { fetchRequest }) => {
    const { preflight, retry, waited } = fetchRequest

    const isRetried = await retry(respond(status, headers))
    const elapsed = await waited(preflight)

    expect(isRetried).toBe(shouldRetry)
    expect(elapsed).toBe(delay)
  })

  it('cooldown doubles', async ({ fetchRequest }) => {
    const { preflight, retry, waited } = fetchRequest
    const expectedDelays = [ 10_000, 20_000, 40_000, 60_000, 60_000 ]

    for (const expectedDelay of expectedDelays) {
      await retry(respond(429))

      const delay = await waited(preflight)

      expect(delay).toBe(expectedDelay)
    }
  })

  it('Retry-After', async ({ fetchRequest }) => {
    const { preflight, retry, waited } = fetchRequest

    await retry(respond(429, { 'Retry-After': '5' }))
    const retryAfterDelay = await waited(preflight)

    await retry(respond(429))
    const cooldownDelay = await waited(preflight)

    expect(retryAfterDelay).toBe(5_000)
    expect(cooldownDelay).toBe(10_000)
  })

  it('success resets cooldown', async ({ fetchRequest }) => {
    const { preflight, process, retry, waited } = fetchRequest

    await retry(respond(429))
    await waited(preflight)
    await retry(respond(429))
    await process(respond(200))
    const resetDelay = await waited(preflight)

    await retry(respond(429))
    const cooldownDelay = await waited(preflight)

    expect(resetDelay).toBe(0)
    expect(cooldownDelay).toBe(10_000)
  })

  it('429 keeps cooldown', async ({ fetchRequest }) => {
    const { preflight, process, retry, waited } = fetchRequest
    const response = respond(429)

    await retry(response)
    const processed = await process(response)
    const delay = await waited(preflight)

    expect(processed).toBe(response)
    expect(delay).toBe(10_000)
  })
})
