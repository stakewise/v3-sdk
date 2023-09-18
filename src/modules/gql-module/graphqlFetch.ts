import AbortRequest from './abortRequest'
import type { FetchInput } from './types'


const graphqlFetch = <Data, Variables, ModifiedData>(
  options: FetchInput<Data, Variables, ModifiedData>
): AbortRequest<Data, ModifiedData> => {
  const { url, query, variables, modifyResult } = options

  const operationName = query
    .replace(/^(query|mutation)\s/, '')
    .replace(/[({].*/, '')
    .trim()

  const opName = operationName ? `?opName=${operationName}` : ''
  const requestUrl = `${url}${opName}`

  const handleRequest = () => (
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
      onSuccess: (data: Data) => typeof modifyResult === 'function'
        ? modifyResult(data)
        : data as unknown as ModifiedData,
    })
  )

  return handleRequest()
}


export default graphqlFetch
