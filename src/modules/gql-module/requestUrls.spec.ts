import { describe, expect, vi, beforeEach } from 'vitest'

import { it } from '../../../test'
import type { GraphqlFixture } from '../../../test/fixtures/graphql'

import RequestUrls from './requestUrls'


type Meta = {
  hasIndexingErrors: boolean
  block: {
    timestamp: number
  }
}

const name = 'SubgraphUrlCheck'
const maxLagSeconds = 450
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
  beforeEach(() => {
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
  })
})
