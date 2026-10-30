import { describe, expect, vi } from 'vitest'

import { it } from '../../../../test'

import type { GraphqlFixture } from '../../../../test/fixtures/graphql'

import getRequestUrl from './getRequestUrl'
import saveErrorUrlToSessionStorage from './saveErrorUrlToSessionStorage'


// test/setup.ts mocks the check for other specs
const { default: checkRequestUrls } = await vi.importActual<typeof import('./checkRequestUrls')>('./checkRequestUrls')

type Meta = {
  hasIndexingErrors: boolean
  block: {
    timestamp: number
  }
}

const name = 'SubgraphUrlCheck'
const timestamp = 1793262647

const getMeta = (lagSeconds: number, hasIndexingErrors = false): Meta => ({
  hasIndexingErrors,
  block: { timestamp: timestamp - lagSeconds },
})

// The check result is cached by urls, every test uses its own ones
let urlsCount = 0

const getUrls = () => {
  urlsCount += 1

  return [ `https://primary-${urlsCount}.io`, `https://replica-${urlsCount}.io` ]
}

const cases = [
  {
    name: 'both are synced',
    primary: getMeta(0),
    replica: getMeta(0),
    isSwitched: false,
  },
  {
    name: 'primary is behind',
    primary: getMeta(301),
    replica: getMeta(0),
    isSwitched: true,
  },
  {
    name: 'primary lag equals the limit',
    primary: getMeta(300),
    replica: getMeta(0),
    isSwitched: false,
  },
  {
    name: 'replica is behind',
    primary: getMeta(0),
    replica: getMeta(301),
    isSwitched: false,
  },
  {
    name: 'primary fails',
    primary: null,
    replica: getMeta(0),
    isSwitched: true,
  },
  {
    name: 'replica fails',
    primary: getMeta(301),
    replica: null,
    isSwitched: false,
  },
  {
    name: 'both fail',
    primary: null,
    replica: null,
    isSwitched: false,
  },
  {
    name: 'primary has indexing errors',
    primary: getMeta(0, true),
    replica: getMeta(0),
    isSwitched: true,
  },
  {
    name: 'both have indexing errors',
    primary: getMeta(0, true),
    replica: getMeta(0, true),
    isSwitched: false,
  },
]

describe('checkRequestUrls', () => {
  const mockUrl = (graphql: GraphqlFixture, url: string, meta: Meta | null) => meta
    ? graphql.mock<{ _meta: Meta }>({ name, url, data: { _meta: meta } })
    : graphql.mockError({ name, url, message: 'Bad gateway' })

  it.for(cases)('$name', async ({ primary, replica, isSwitched }, { graphql }) => {
    const urls = getUrls()

    mockUrl(graphql, urls[0], primary)
    mockUrl(graphql, urls[1], replica)

    await checkRequestUrls(urls)

    expect(getRequestUrl(urls)).toEqual(isSwitched ? urls[1] : urls[0])
    expect(graphql.calls).toEqual([
      expect.objectContaining({ url: urls[0], operationName: name }),
      expect.objectContaining({ url: urls[1], operationName: name }),
    ])
  })

  it('switches back to the primary if the replica is behind', async ({ graphql }) => {
    const urls = getUrls()

    saveErrorUrlToSessionStorage(urls, urls[0])
    mockUrl(graphql, urls[0], getMeta(0))
    mockUrl(graphql, urls[1], getMeta(301))

    await checkRequestUrls(urls)

    expect(getRequestUrl(urls)).toEqual(urls[0])
  })

  it('keeps the marks of other urls', async ({ graphql }) => {
    const urls = getUrls()
    const otherUrls = getUrls()

    saveErrorUrlToSessionStorage(otherUrls, otherUrls[0])
    mockUrl(graphql, urls[0], getMeta(301))
    mockUrl(graphql, urls[1], getMeta(0))

    await checkRequestUrls(urls)

    expect(getRequestUrl(urls)).toEqual(urls[1])
    expect(getRequestUrl(otherUrls)).toEqual(otherUrls[1])
  })

  it('checks once a minute on the server', async ({ graphql }) => {
    const urls = getUrls()
    const now = Date.now()
    const dateSpy = vi.spyOn(Date, 'now')

    mockUrl(graphql, urls[0], getMeta(301))
    mockUrl(graphql, urls[1], getMeta(0))

    await Promise.all([ checkRequestUrls(urls), checkRequestUrls(urls) ])

    expect(graphql.calls).toHaveLength(2)
    expect(getRequestUrl(urls)).toEqual(urls[1])

    dateSpy.mockReturnValue(now + 60_001)

    expect(getRequestUrl(urls)).toEqual(urls[0])

    mockUrl(graphql, urls[0], getMeta(0))

    await checkRequestUrls(urls)

    expect(graphql.calls).toHaveLength(4)
    expect(getRequestUrl(urls)).toEqual(urls[0])

    dateSpy.mockRestore()
  })
})
