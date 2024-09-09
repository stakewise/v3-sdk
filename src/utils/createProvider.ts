import { JsonRpcProvider, FallbackProvider, FetchRequest, FetchResponse } from 'ethers'

import apiUrls from './apiUrls'


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

const createProvider = (options: StakeWise.Options) => {
  const { network } = options

  const urls = options.endpoints?.web3 as string | string[]
  const arrayUrls = typeof urls === 'string' ? [ urls ] : urls

  if (arrayUrls.length === 1) {
    const fetchRequest = getFetchRequest(arrayUrls[0])

    return new JsonRpcProvider(fetchRequest, network)
  }
  else {
    const providers: ConstructorParameters<typeof FallbackProvider>[0] = arrayUrls.map((url, index) => {
      const fetchRequest = getFetchRequest(url)

      return {
        provider: new JsonRpcProvider(fetchRequest, network),
        priority: index + 1,
        weight: 1,
      }
    })

    const provider = new FallbackProvider(providers, network) as StakeWise.CustomFallbackProvider

    provider.getSigner = () => {
      throw new Error('Pass your provider to the SDK class instance to get a signer')
    }

    provider.send = () => {
      throw new Error('Pass your provider to the SDK class instance to use send method')
    }

    return provider
  }
}


export default createProvider
