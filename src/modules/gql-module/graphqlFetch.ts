import AbortRequest from './abortRequest'
import type { FetchInput } from './types'


type ExtendedFetchInput<Data, Variables, ModifiedData> = FetchInput<Data, Variables, ModifiedData> & {
  retryCount?: number
}

const sessionErrorUrl = 'errorUrl'

const saveErrorUrlToSessionStorage = (url: string) => {
  try {
    const currentErrorUrl = sessionStorage.getItem(sessionErrorUrl)

    if (currentErrorUrl !== url) {
      sessionStorage.setItem(sessionErrorUrl, url)
    }
  } catch (error) {
    console.error('Failed to save error URL to sessionStorage:', error)
  }
}

const clearErrorUrlInterval = () => {
  setInterval(() => {
    try {
      const currentErrorUrl = sessionStorage.getItem(sessionErrorUrl)
      if (currentErrorUrl) {
        sessionStorage.removeItem(sessionErrorUrl)
      }

    } catch (error) {
      console.error('Failed to clear sessionErrorUrl from sessionStorage:', error)
    }
  }, 3_600_000) // 1 hour
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
  const primaryUrl: string = isUrlArrayValid ? url[0] : url
  const backupUrl: string | null = isUrlArrayValid && url.length > 1 ? url[1] : null

  const currentErrorUrl = sessionStorage.getItem(sessionErrorUrl)
  const validUrl = (currentErrorUrl === primaryUrl && backupUrl) ? backupUrl : primaryUrl
  const opName = operationName ? `?opName=${operationName}` : ''
  const requestUrl = `${validUrl}${opName}`

  clearErrorUrlInterval()

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
