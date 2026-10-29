import AbortRequest from './abortRequest'
import type { FetchInput } from './types'
import { getRequestUrl, saveErrorUrlToSessionStorage, applySubgraphErrorPolicy } from './utils'


type ExtendedFetchInput<Data, Variables, ModifiedData> = FetchInput<Data, Variables, ModifiedData> & {
  retryCount?: number
}

const graphqlFetch = <Data, Variables, ModifiedData>(
  options: ExtendedFetchInput<Data, Variables, ModifiedData>
): AbortRequest<Data, ModifiedData> => {
  const { url, query, variables, withTime, retryCount = 0, subgraphError, modifyResult, onSubgraphError } = options

  const operationName = query
    .replace(/^(query|mutation)\s/, '')
    .replace(/[({].*/, '')
    .trim()

  const currentUrl = getRequestUrl(url)
  const opName = operationName ? `?opName=${operationName}` : ''

  let time = withTime ? `t=${new Date().getTime()}` : ''

  if (withTime) {
    time = opName ? `&${time}` : `?${time}`
  }

  const requestUrl = `${currentUrl}${opName}${time}`

  return new AbortRequest<Data, ModifiedData>(requestUrl, {
    method: 'POST',
    headers: {
      'content-type': 'application/json; charset=utf-8',
    },
    body: JSON.stringify({
      query: applySubgraphErrorPolicy(query, subgraphError),
      variables,
      operationName,
    }),
    subgraphError,
    onSubgraphError: typeof onSubgraphError === 'function'
      ? (event) => onSubgraphError({ ...event, url: currentUrl, operationName, variables })
      : undefined,
    onSuccess: (data: Data) => typeof modifyResult === 'function'
      ? modifyResult(data)
      : data as unknown as ModifiedData,
    onError: (error: Error | any) => {
      const hasBackupUrl = Array.isArray(url) && url.length > 1

      if (hasBackupUrl && retryCount < 1) {
        saveErrorUrlToSessionStorage(currentUrl)

        return graphqlFetch({
          ...options,
          retryCount: retryCount + 1,
        })
      }

      return Promise.reject(error)
    },
  })
}


export default graphqlFetch
