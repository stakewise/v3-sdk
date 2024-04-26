import AbortRequest from './abortRequest'
import type { FetchInput } from './types'
import { getRequestUrl, saveErrorUrlToSessionStorage } from './utils'


type ExtendedFetchInput<Data, Variables, ModifiedData> = FetchInput<Data, Variables, ModifiedData> & {
  retryCount?: number
}

const graphqlFetch = <Data, Variables, ModifiedData>(
  options: ExtendedFetchInput<Data, Variables, ModifiedData>
): AbortRequest<Data, ModifiedData> => {
  const { url, query, variables, retryCount = 0, modifyResult } = options

  const operationName = query
    .replace(/^(query|mutation)\s/, '')
    .replace(/[({].*/, '')
    .trim()

  const currentUrl = getRequestUrl(url)
  const opName = operationName ? `?opName=${operationName}` : ''
  const requestUrl = `${currentUrl}${opName}`

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
      const hasBackupUrl = Array.isArray(url) && url.length > 1

      if (hasBackupUrl && retryCount < 1) {
        saveErrorUrlToSessionStorage(url[0])

        return graphqlFetch({
          ...options,
          url: url[1],
          retryCount: retryCount + 1,
        })
      }

      return Promise.reject(error)
    },
  })
}


export default graphqlFetch
