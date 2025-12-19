import { FetchRequest, FetchResponse } from 'ethers'


const getFetchRequest = (_url: string | StakeWise.UrlWithHeaders) => {
  const url = typeof _url === 'string' ? _url : _url.url
  const headers = typeof _url === 'string' ? {} : _url.headers

  // Why do we use FetchRequest and change the behavior of the 429 error?
  // Because inside ethers error 429 is handled only by resending the request
  // and in this case no additional node is started. This is a problem for public nodes,
  // so we think it is better to use an additional node in case of 429 error
  const fetchRequest = new FetchRequest(url)

  Object.keys(headers).forEach((key) => {
    fetchRequest.setHeader(key, headers[key])
  })

  fetchRequest.setThrottleParams({
    slotInterval: 2 * 1000,
    maxAttempts: 2,
  })

  fetchRequest.processFunc = async (_, response) => {
    if (response.statusCode === 429) {
      // mutate the response to 500 to start an additional node
      // https://github.com/ethers-io/ethers.js/blob/main/src.ts/utils/fetch.ts#L519
      return new FetchResponse(500, '', response.headers, null)
    }

    return response
  }

  fetchRequest.retryFunc = async (_, response) => {
    // stop retry attempts
    // https://github.com/ethers-io/ethers.js/blob/main/src.ts/utils/fetch.ts#L556
    return response.statusCode !== 429
  }

  return fetchRequest
}


export default getFetchRequest
