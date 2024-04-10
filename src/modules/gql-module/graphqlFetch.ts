import AbortRequest from './abortRequest'
import type { FetchInput } from './types'


interface ExtendedFetchInput<Data, Variables, ModifiedData> extends FetchInput<Data, Variables, ModifiedData> {
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

  const isUrlArray = Array.isArray(url)
  const primaryUrl = isUrlArray ? url[0] : url

  const opName = operationName ? `?opName=${operationName}` : ''
  const requestUrl = `${primaryUrl}${opName}`

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
      const backupUrl = isUrlArray ? url[1] : null

      if (backupUrl && retryCount < 1) {
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
