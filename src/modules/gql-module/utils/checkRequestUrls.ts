import getRequestUrl from './getRequestUrl'
import saveErrorUrlToSessionStorage from './saveErrorUrlToSessionStorage'


type Meta = {
  hasIndexingErrors: boolean
  block: {
    timestamp: number
  }
}

type Check = {
  promise: Promise<void>
  expiresAt: number
}

const maxLagSeconds = 300
const requestTimeout = 3_000
const operationName = 'SubgraphUrlCheck'
const query = `query ${operationName} { _meta { hasIndexingErrors block { timestamp } } }`

const isServer = typeof window === 'undefined'

// On the server the result is shared between all users, so it is rechecked every minute
const checkTime = isServer ? 60 * 1_000 : Infinity

const checks = new Map<string, Check>()

const fetchMeta = async (url: string): Promise<Meta | null> => {
  try {
    const response = await fetch(`${url}?opName=${operationName}`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify({ query, operationName }),
      signal: AbortSignal.timeout(requestTimeout),
    })

    const json = await response.json()

    return json?.data?._meta || null
  }
  catch {
    return null
  }
}

const isWorse = (current: Meta | null, other: Meta | null) => {
  if (!other) {
    return false
  }

  if (!current) {
    return true
  }

  if (current.hasIndexingErrors !== other.hasIndexingErrors) {
    return current.hasIndexingErrors
  }

  return other.block.timestamp - current.block.timestamp > maxLagSeconds
}

const check = async (urls: ReadonlyArray<string>) => {
  const currentUrl = getRequestUrl(urls)
  const otherUrl = currentUrl === urls[0]
    ? urls[1]
    : urls[0]

  const [ current, other ] = await Promise.all([
    fetchMeta(currentUrl),
    fetchMeta(otherUrl),
  ])

  if (isWorse(current, other)) {
    saveErrorUrlToSessionStorage(urls, currentUrl, isServer ? checkTime : undefined)
  }
}

// Compares the subgraph urls before the first request and marks the current one as failed if it is behind the other one
const checkRequestUrls = (urls: ReadonlyArray<string>): Promise<void> => {
  const key = urls.join(',')
  const cached = checks.get(key)

  if (cached && cached.expiresAt > Date.now()) {
    return cached.promise
  }

  const promise = check(urls)

  checks.set(key, { promise, expiresAt: Date.now() + checkTime })

  return promise
}


export default checkRequestUrls
