import AbortRequest from './abortRequest'
import type { FetchInput } from './types'
import { getRequestUrl, resolveRequestUrl, applySubgraphErrorPolicy, saveErrorUrlToSessionStorage } from './utils'


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

  // Updated after the urls check, before the request
  let currentUrl = getRequestUrl(url)

  const opName = operationName ? `?opName=${operationName}` : ''

  let time = withTime ? `t=${new Date().getTime()}` : ''

  if (withTime) {
    time = opName ? `&${time}` : `?${time}`
  }

  const params = `${opName}${time}`
  const isUrlsList = Array.isArray(url) && url.length > 1

  const requestId = isUrlsList
    ? `${url.join(',')}${params}`
    : `${currentUrl}${params}`

  return new AbortRequest<Data, ModifiedData>(requestId, {
    method: 'POST',
    headers: {
      'content-type': 'application/json; charset=utf-8',
    },
    body: JSON.stringify({
      query: applySubgraphErrorPolicy(query, subgraphError),
      variables,
      operationName,
    }),
    getUrl: isUrlsList
      ? async () => {
        currentUrl = await resolveRequestUrl(url)

        return `${currentUrl}${params}`
      }
      : undefined,
    subgraphError,
    onSubgraphError: typeof onSubgraphError === 'function'
      ? (event) => onSubgraphError({ ...event, url: currentUrl, operationName, variables })
      : undefined,
    onSuccess: (data: Data) => typeof modifyResult === 'function'
      ? modifyResult(data)
      : data as unknown as ModifiedData,
    onError: (error: Error | any) => {
      if (isUrlsList && retryCount < 1) {
        saveErrorUrlToSessionStorage(url, currentUrl)

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
