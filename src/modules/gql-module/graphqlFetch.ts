import RequestUrls from './requestUrls'
import AbortRequest from './abortRequest'
import type { FetchInput } from './types'
import { applySubgraphErrorPolicy } from './utils'


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

  const requestUrls = RequestUrls.get(url)

  // Changes if the subgraph check switches the url
  let currentUrl = requestUrls.getUrl()

  const opName = operationName ? `?opName=${operationName}` : ''

  let time = withTime ? `t=${new Date().getTime()}` : ''

  if (withTime) {
    time = opName ? `&${time}` : `?${time}`
  }

  const params = `${opName}${time}`
  const { isList } = requestUrls

  const requestId = isList
    ? `${requestUrls.urls.join(',')}${params}`
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
    fetchResponse: isList
      ? (requestInit) => {
        // Only the subgraph requests pass the error policy, other graphql servers don't answer _meta
        if (subgraphError) {
          return requestUrls.subgraphFetch(params, requestInit, (checkedUrl) => {
            currentUrl = checkedUrl
          })
        }

        return fetch(`${currentUrl}${params}`, requestInit)
      }
      : undefined,
    subgraphError,
    onSubgraphError: typeof onSubgraphError === 'function'
      ? (event) => onSubgraphError({ ...event, url: currentUrl, operationName, variables })
      : undefined,
    onSuccess: (data: Data) => typeof modifyResult === 'function'
      ? modifyResult(data)
      : data as unknown as ModifiedData,
    onError: (error: Error | any, type) => {
      // Each url of the list is tried once
      if (isList && retryCount < requestUrls.urls.length - 1 && type !== 'onsuccess') {
        requestUrls.markFailed(currentUrl)

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
