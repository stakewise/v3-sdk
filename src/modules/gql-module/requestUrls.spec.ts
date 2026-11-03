import { describe, expect, vi, beforeAll } from 'vitest'

import { it } from '../../../test'
import type { GraphqlFixture } from '../../../test/fixtures/graphql'

import RequestUrls from './requestUrls'


type Meta = {
  hasIndexingErrors: boolean
  block: {
    timestamp: number
  }
}

type TestPayload = {
  vaults: Array<{ id: string }>
}

const name = 'SubgraphUrlCheck'
const maxLagSeconds = 450
const answerTimeout = 1_000
const timestamp = 1793262647

const getMeta = (lagSeconds: number, hasIndexingErrors = false): Meta => ({
  hasIndexingErrors,
  block: { timestamp: timestamp - lagSeconds },
})

// Instances and their subgraph check are cached by urls, every test uses its own ones
let urlsCount = 0

const getUrls = (count = 2) => {
  urlsCount += 1

  return Array.from({ length: count }, (_, index) => `https://subgraph-${urlsCount}-${index}.io`)
}

const mockUrl = (graphql: GraphqlFixture, url: string, meta: Meta | null) => meta
  ? graphql.mock<{ _meta: Meta }>({ name, url, data: { _meta: meta } })
  : graphql.mockError({ name, url, message: 'Bad gateway' })

// The url answers after the delay or never
const delayUrl = (url: string, delay = Infinity) => {
  const graphqlFetch = globalThis.fetch

  vi.stubGlobal('fetch', async (input: string, init?: RequestInit) => {
    if (input.startsWith(url)) {
      await new Promise((resolve) => delay < Infinity && setTimeout(resolve, delay))
    }

    return graphqlFetch(input, init)
  })
}

const testName = 'Test'

const testInit = {
  method: 'POST',
  body: JSON.stringify({ query: `query ${testName} { vaults { id } }`, operationName: testName }),
}

const subgraphCases = [
  {
    name: 'all are synced',
    metas: [ getMeta(0), getMeta(0) ],
    expected: 0,
  },
  {
    name: 'primary is behind',
    metas: [ getMeta(maxLagSeconds + 1), getMeta(0) ],
    expected: 1,
  },
  {
    name: 'primary lag equals the limit',
    metas: [ getMeta(maxLagSeconds), getMeta(0) ],
    expected: 0,
  },
  {
    name: 'backup is behind',
    metas: [ getMeta(0), getMeta(maxLagSeconds + 1) ],
    expected: 0,
  },
  {
    name: 'primary fails',
    metas: [ null, getMeta(0) ],
    expected: 1,
  },
  {
    name: 'backup fails',
    metas: [ getMeta(maxLagSeconds + 1), null ],
    expected: 0,
  },
  {
    name: 'all fail',
    metas: [ null, null ],
    expected: 0,
  },
  {
    name: 'primary has indexing errors',
    metas: [ getMeta(0, true), getMeta(0) ],
    expected: 1,
  },
  {
    name: 'all have indexing errors',
    metas: [ getMeta(0, true), getMeta(0, true) ],
    expected: 0,
  },
  {
    name: 'third url: primary and the second are behind',
    metas: [ getMeta(maxLagSeconds + 1), getMeta(maxLagSeconds + 100), getMeta(0) ],
    expected: 2,
  },
  {
    name: 'third url: the second fails, primary is synced',
    metas: [ getMeta(0), null, getMeta(0) ],
    expected: 0,
  },
  {
    name: 'third url: primary fails, the second has indexing errors',
    metas: [ null, getMeta(0, true), getMeta(12) ],
    expected: 2,
  },
]

describe('RequestUrls', () => {
  beforeAll(() => {
    // test/setup.ts mocks the subgraph check for other specs
    vi.mocked(RequestUrls.prototype.subgraphCheck).mockRestore()
  })

  it('returns a single url', () => {
    const [ url ] = getUrls(1)

    expect(RequestUrls.get(url).getUrl()).toEqual(url)
    expect(RequestUrls.get(url).isList).toBe(false)
  })

  it('returns the same instance for the same urls', () => {
    const urls = getUrls()

    expect(RequestUrls.get(urls)).toBe(RequestUrls.get([ ...urls ]))
  })

  it('throws for an empty list', () => {
    expect(() => RequestUrls.get([])).toThrow('The array does not contain the url for the query')
  })

  it('returns the first url that is not marked', () => {
    const urls = getUrls(3)
    const requestUrls = RequestUrls.get(urls)

    expect(requestUrls.getUrl()).toEqual(urls[0])

    requestUrls.markFailed(urls[0])
    expect(requestUrls.getUrl()).toEqual(urls[1])

    requestUrls.markFailed(urls[1])
    expect(requestUrls.getUrl()).toEqual(urls[2])
  })

  it('returns the url with the earliest mark if all are marked', () => {
    const urls = getUrls(3)
    const requestUrls = RequestUrls.get(urls)
    const now = Date.now()
    const dateSpy = vi.spyOn(Date, 'now')

    dateSpy.mockReturnValue(now)
    requestUrls.markFailed(urls[1])
    dateSpy.mockReturnValue(now + 1)
    requestUrls.markFailed(urls[0])
    dateSpy.mockReturnValue(now + 2)
    requestUrls.markFailed(urls[2])

    expect(requestUrls.getUrl()).toEqual(urls[1])

    dateSpy.mockRestore()
  })

  it('shares the marks between lists with the same url', () => {
    const [ primary, backup ] = getUrls()
    const [ otherBackup ] = getUrls(1)

    RequestUrls.get([ primary, backup ]).markFailed(primary)

    expect(RequestUrls.get([ primary, otherBackup ]).getUrl()).toEqual(otherBackup)
  })

  it('marks expire after a minute on the server', () => {
    const urls = getUrls()
    const requestUrls = RequestUrls.get(urls)
    const now = Date.now()
    const dateSpy = vi.spyOn(Date, 'now').mockReturnValue(now)

    requestUrls.markFailed(urls[0])
    expect(requestUrls.getUrl()).toEqual(urls[1])

    dateSpy.mockReturnValue(now + 60_001)
    expect(requestUrls.getUrl()).toEqual(urls[0])

    dateSpy.mockRestore()
  })

  describe('subgraphCheck', () => {
    it.for(subgraphCases)('$name', async ({ metas, expected }, { graphql }) => {
      const urls = getUrls(metas.length)

      urls.forEach((url, index) => mockUrl(graphql, url, metas[index]))

      const requestUrls = RequestUrls.get(urls)

      await requestUrls.subgraphCheck()

      expect(requestUrls.getUrl()).toEqual(urls[expected])
      expect(graphql.calls).toEqual(urls.map((url) => expect.objectContaining({ url, operationName: name })))
    })

    it('doesn\'t request a single url', async ({ graphql }) => {
      const [ url ] = getUrls(1)

      await RequestUrls.get(url).subgraphCheck()

      expect(graphql.calls).toHaveLength(0)
    })

    it('switches back to the primary if it is synced', async ({ graphql }) => {
      const urls = getUrls()
      const requestUrls = RequestUrls.get(urls)

      requestUrls.markFailed(urls[0])
      mockUrl(graphql, urls[0], getMeta(0))
      mockUrl(graphql, urls[1], getMeta(maxLagSeconds + 1))

      await requestUrls.subgraphCheck()

      expect(requestUrls.getUrl()).toEqual(urls[0])
    })

    it('keeps the marks of other urls', async ({ graphql }) => {
      const urls = getUrls()
      const [ otherUrl ] = getUrls(1)

      RequestUrls.get(otherUrl).markFailed(otherUrl)
      mockUrl(graphql, urls[0], getMeta(maxLagSeconds + 1))
      mockUrl(graphql, urls[1], getMeta(0))

      await RequestUrls.get(urls).subgraphCheck()

      expect(RequestUrls.get([ otherUrl, urls[1] ]).getUrl()).toEqual(urls[1])
    })

    it('checks once a minute on the server', async ({ graphql }) => {
      const urls = getUrls()
      const requestUrls = RequestUrls.get(urls)
      const now = Date.now()
      const dateSpy = vi.spyOn(Date, 'now').mockReturnValue(now)

      mockUrl(graphql, urls[0], getMeta(maxLagSeconds + 1))
      mockUrl(graphql, urls[1], getMeta(0))

      await Promise.all([ requestUrls.subgraphCheck(), requestUrls.subgraphCheck() ])

      expect(graphql.calls).toHaveLength(2)
      expect(requestUrls.getUrl()).toEqual(urls[1])

      dateSpy.mockReturnValue(now + 60_001)
      mockUrl(graphql, urls[0], getMeta(0))

      await requestUrls.subgraphCheck()

      expect(graphql.calls).toHaveLength(4)
      expect(requestUrls.getUrl()).toEqual(urls[0])

      dateSpy.mockRestore()
    })

    it('doesn\'t wait for a hanging backup if the primary is healthy', async ({ graphql, clock }) => {
      const urls = getUrls()
      const requestUrls = RequestUrls.get(urls)

      requestUrls.markFailed(urls[1])
      mockUrl(graphql, urls[0], getMeta(0))
      delayUrl(urls[1])

      const check = requestUrls.subgraphCheck()

      await clock.advanceTimersByTimeAsync(answerTimeout)
      await check

      expect(requestUrls.getUrl()).toEqual(urls[0])
      // The backup mark is kept
      expect(RequestUrls.get([ urls[1], urls[0] ]).getUrl()).toEqual(urls[0])
    })

    it('compares the primary with the backup that answered in time', async ({ graphql, clock }) => {
      const urls = getUrls()
      const requestUrls = RequestUrls.get(urls)

      mockUrl(graphql, urls[0], getMeta(maxLagSeconds + 1))
      mockUrl(graphql, urls[1], getMeta(0))
      delayUrl(urls[1], answerTimeout - 1)

      const check = requestUrls.subgraphCheck()

      await clock.advanceTimersByTimeAsync(answerTimeout)
      await check

      expect(requestUrls.getUrl()).toEqual(urls[1])
    })

    it('waits for the backup if the primary has indexing errors', async ({ graphql, clock }) => {
      const urls = getUrls()
      const requestUrls = RequestUrls.get(urls)
      let isChecked = false

      mockUrl(graphql, urls[0], getMeta(0, true))
      mockUrl(graphql, urls[1], getMeta(0))
      delayUrl(urls[1], answerTimeout * 2)

      const check = requestUrls.subgraphCheck().then(() => {
        isChecked = true
      })

      await clock.advanceTimersByTimeAsync(answerTimeout)
      expect(isChecked).toBe(false)

      await clock.advanceTimersByTimeAsync(answerTimeout)
      await check

      expect(requestUrls.getUrl()).toEqual(urls[1])
    })
  })

  describe('subgraphFetch', () => {
    it('uses the response of the url that passed the check', async ({ graphql }) => {
      const urls = getUrls()
      const requestUrls = RequestUrls.get(urls)
      const onUrl = vi.fn()

      mockUrl(graphql, urls[0], getMeta(0))
      mockUrl(graphql, urls[1], getMeta(0))
      graphql.mock<TestPayload>({ name: testName, url: urls[0], data: { vaults: [] } })

      const response = await requestUrls.subgraphFetch(`?opName=${testName}`, testInit, onUrl)

      expect(await response.json()).toEqual({ data: { vaults: [] } })
      expect(onUrl.mock.calls).toEqual([ [ urls[0] ] ])
      expect(graphql.calls.filter(({ operationName }) => operationName === testName)).toEqual([
        expect.objectContaining({ url: urls[0] }),
      ])
    })

    it('requests the url chosen by the check', async ({ graphql }) => {
      const urls = getUrls()
      const requestUrls = RequestUrls.get(urls)
      const onUrl = vi.fn()
      const fetchSpy = vi.spyOn(globalThis, 'fetch')

      mockUrl(graphql, urls[0], getMeta(maxLagSeconds + 1))
      mockUrl(graphql, urls[1], getMeta(0))
      graphql.mock<TestPayload>({ name: testName, url: urls[0], data: { vaults: [] } })
      graphql.mock<TestPayload>({ name: testName, url: urls[1], data: { vaults: [ { id: '0x1' } ] } })

      const response = await requestUrls.subgraphFetch(`?opName=${testName}`, testInit, onUrl)
      const [ , primaryInit ] = fetchSpy.mock.calls.find(([ input ]) => String(input) === `${urls[0]}?opName=${testName}`) || []

      expect(await response.json()).toEqual({ data: { vaults: [ { id: '0x1' } ] } })
      expect(onUrl.mock.calls).toEqual([ [ urls[0] ], [ urls[1] ] ])
      expect(primaryInit?.signal?.aborted).toBe(true)
    })

    it('aborts the request with the passed signal', async ({ graphql }) => {
      const urls = getUrls()
      const requestUrls = RequestUrls.get(urls)
      const controller = new AbortController()
      const fetchSpy = vi.spyOn(globalThis, 'fetch')

      mockUrl(graphql, urls[0], getMeta(0))
      mockUrl(graphql, urls[1], getMeta(0))
      graphql.mock<TestPayload>({ name: testName, url: urls[0], data: { vaults: [] } })

      await requestUrls.subgraphFetch(`?opName=${testName}`, { ...testInit, signal: controller.signal }, vi.fn())
      controller.abort()

      const [ , init ] = fetchSpy.mock.calls.find(([ input ]) => String(input) === `${urls[0]}?opName=${testName}`) || []

      expect(init?.signal?.aborted).toBe(true)
    })
  })
})
