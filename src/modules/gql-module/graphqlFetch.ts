import AbortRequest from './abortRequest'
import {
  getRequestUrl,
  getCacheData,
  setCacheData,
  saveErrorUrlToSessionStorage,
} from './utils'


// eslint-disable-next-line max-len
const graphqlFetch = <Data, Variables, ModifiedData>(options: ModuleGQL.FetchInput<Data, Variables, ModifiedData>): AbortRequest<Data, ModifiedData> => {
  const {
    url,
    query,
    cache,
    cacheId,
    variables,
    requestPolicy = 'cache-first',
    modifyResult,
  } = options

  const isSkipCacheSet = requestPolicy === 'no-cache'
  const isSkipCacheCheck = isSkipCacheSet || requestPolicy === 'network-only'

  const cacheData = getCacheData<Data, Variables>({ cache, variables, cacheId })
  const withModify = typeof modifyResult === 'function'

  const handleRequest = (count?: number): AbortRequest<Data, ModifiedData> => {
    const retryCount = count || 0

    const operationName = query
      .replace(/^(query|mutation)\s/, '')
      .replace(/[({].*/, '')
      .trim()

    const currentUrl = getRequestUrl(url)
    const opName = operationName ? `?opName=${operationName}` : ''
    const requestUrl = `${currentUrl}${opName}`

    return (
      new AbortRequest<Data, ModifiedData>(requestUrl, {
        method: 'POST',
        headers: {
          'content-type': 'application/json; charset=utf-8',
        },
        body: JSON.stringify({
          query,
          variables,
          operationName,
        }),
        onSuccess: (data: unknown) => {
          if (isSkipCacheSet) {
            return withModify
              ? modifyResult(data as Data)
              : data as ModifiedData
          }

          const cacheData = setCacheData<Data, Variables>({
            data: data as Data,
            variables,
            cacheId,
            cache,
          }) as unknown

          return withModify
            ? modifyResult(cacheData as Data)
            : cacheData as ModifiedData
        },
        onError: (error: any) => {
          const hasBackupUrl = Array.isArray(url) && url.length > 1

          if (hasBackupUrl && retryCount < 1) {
            saveErrorUrlToSessionStorage(url[0])

            return handleRequest(retryCount + 1)
          }

          return Promise.reject(error)
        },
      })
    )
  }

  if (cacheData && !isSkipCacheCheck) {
    if (requestPolicy === 'cache-and-network') {
      handleRequest()
    }

    const result = withModify ? modifyResult(cacheData) : cacheData

    // @ts-ignore
    return Promise.resolve(result) as Promise<ModifiedData>
  }

  return handleRequest()
}


export default graphqlFetch
