import { constants } from '../../helpers'
import localStorage from '../local-storage'


type Meta = {
  hasIndexingErrors: boolean
  block: {
    timestamp: number
  }
}

// Failed url → mark expiration time
type FailedUrls = Record<string, number | undefined>

type SubgraphCheck = {
  promise: Promise<void>
  expiresAt: number
}

const storageName = constants.sessionStorageNames.moduleErrorUrl

const maxLagSeconds = 450
const requestTimeout = 4_000
const operationName = 'SubgraphUrlCheck'
const query = `query ${operationName} { _meta { hasIndexingErrors block { timestamp } } }`

const isServer = typeof window === 'undefined'

// On the server the marks are shared between all users, so they live for a minute and the subgraph is rechecked every minute
const markTime = isServer
  ? 60 * 1_000
  : 60 * 60 * 1_000

const subgraphCheckTime = isServer ? 60 * 1_000 : Infinity

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

const getActualFailedUrls = (): FailedUrls => {
  const failedUrls = localStorage.getSessionItem<FailedUrls>(storageName) || {}
  const now = Date.now()

  return Object.fromEntries(
    Object.entries(failedUrls).filter(([ , expiresAt ]) => Number(expiresAt) > now)
  )
}

class RequestUrls {
  readonly urls: ReadonlyArray<string>
  private subgraphCheckState?: SubgraphCheck
  private static instances = new Map<string, RequestUrls>()

  private constructor(urls: ReadonlyArray<string>) {
    this.urls = urls
  }

  static get(url: string | ReadonlyArray<string>): RequestUrls {
    const urls = typeof url === 'string' ? [ url ] : url

    if (!urls.length) {
      throw new Error('The array does not contain the url for the query')
    }

    const key = urls.join(',')
    let instance = RequestUrls.instances.get(key)

    if (!instance) {
      instance = new RequestUrls(urls)
      RequestUrls.instances.set(key, instance)
    }

    return instance
  }

  get isList() {
    return this.urls.length > 1
  }

  getUrl(): string {
    const failedUrls = getActualFailedUrls()
    const url = this.urls.find((url) => !failedUrls[url])

    if (url) {
      return url
    }

    // All urls are marked, the one whose mark expires first is likely to recover first
    return [ ...this.urls ].sort((a, b) => Number(failedUrls[a]) - Number(failedUrls[b]))[0]
  }

  markFailed(url: string) {
    localStorage.setSessionItem(storageName, {
      ...getActualFailedUrls(),
      [url]: Date.now() + markTime,
    })
  }

  // Compares the subgraph urls by _meta and marks the ones that fail, are behind or have indexing errors
  subgraphCheck(): Promise<void> {
    if (!this.isList) {
      return Promise.resolve()
    }

    if (this.subgraphCheckState && this.subgraphCheckState.expiresAt > Date.now()) {
      return this.subgraphCheckState.promise
    }

    const promise = this.runSubgraphCheck()

    this.subgraphCheckState = {
      promise,
      expiresAt: Date.now() + subgraphCheckTime,
    }

    return promise
  }

  private async runSubgraphCheck() {
    const metas = await Promise.all(this.urls.map(fetchMeta))
    const answered = metas.filter((meta): meta is Meta => Boolean(meta))

    // Nothing to compare with, the request errors will switch the url
    if (!answered.length) {
      return
    }

    const healthy = answered.filter((meta) => !meta.hasIndexingErrors)
    const references = healthy.length ? healthy : answered
    const latestTimestamp = Math.max(...references.map((meta) => meta.block.timestamp))

    const failedUrls = getActualFailedUrls()
    const now = Date.now()

    metas.forEach((meta, index) => {
      const url = this.urls[index]

      const isWorse = (
        !meta
        || (healthy.length > 0 && meta.hasIndexingErrors)
        || latestTimestamp - meta.block.timestamp > maxLagSeconds
      )

      failedUrls[url] = isWorse ? now + markTime : undefined
    })

    localStorage.setSessionItem(storageName, failedUrls)
  }
}


export default RequestUrls
