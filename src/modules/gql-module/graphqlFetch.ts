import AbortRequest from './abortRequest'
import type { FetchInput } from './types'


type ExtendedFetchInput<Data, Variables, ModifiedData> = FetchInput<Data, Variables, ModifiedData> & {
  retryCount?: number
}

const sessionErrorUrls = 'errorUrls'

const saveErrorUrlToSessionStorage = (url: string) => {
  const errorUrls = JSON.parse(sessionStorage.getItem(sessionErrorUrls) || '[]')

  if (!errorUrls.includes(url)) {
    errorUrls.push(url)
    sessionStorage.setItem(sessionErrorUrls, JSON.stringify(errorUrls))
  }
}

const graphqlFetch = <Data, Variables, ModifiedData>(
  options: ExtendedFetchInput<Data, Variables, ModifiedData>
): AbortRequest<Data, ModifiedData> => {
  const { url, query, variables, retryCount = 0, modifyResult } = options

  const operationName = query
    .replace(/^(query|mutation)\s/, '')
    .replace(/[({].*/, '')
    .trim()

  const isUrlArrayValid = Array.isArray(url) && url.length > 0
  const primaryUrl = isUrlArrayValid ? url[0] : url
  const backupUrl = isUrlArrayValid && url.length > 1 ? url[1] : null

  const errorUrls = JSON.parse(sessionStorage.getItem(sessionErrorUrls) || '[]')
  const validUrl = errorUrls.includes(primaryUrl) ? backupUrl : primaryUrl
  const opName = operationName ? `?opName=${operationName}` : ''
  const requestUrl = `${validUrl}${opName}`

  return new AbortRequest<Data, ModifiedData>(requestUrl, {
    method: 'POST',
    headers: {
      'content-type': 'application/json; charset=utf-8',
    },
    body: JSON.stringify({
      query,
      variables,
      operationName,
    }),
    onSuccess: (data: Data) => typeof modifyResult === 'function'
      ? modifyResult(data)
      : data as unknown as ModifiedData,
    onError: (error: Error | any) => {
      if (backupUrl && retryCount < 1) {
        saveErrorUrlToSessionStorage(primaryUrl)

        return graphqlFetch({
          ...options,
          url: backupUrl,
          retryCount: retryCount + 1,
        })
      }

      return Promise.reject(error)
    },
  })
}


export default graphqlFetch
