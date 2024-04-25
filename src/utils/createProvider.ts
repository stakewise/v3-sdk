import { JsonRpcProvider, FallbackProvider, FetchRequest, FetchResponse } from 'ethers'

import configs from './configs'
import { Network } from './enums'


type Input = {
  urls: string | string[]
  network: Network
}

const createProvider = (values: Input) => {
  const { urls, network } = values

  if (!urls) {
    return new JsonRpcProvider(configs[network].network.url)
  }

  if (Array.isArray(urls)) {
    if (urls.length === 1) {
      return new JsonRpcProvider(urls[0])
    }
    else {
      const providers: ConstructorParameters<typeof FallbackProvider>[0] = urls.map((url, index) => {
        // Why do we use FetchRequest and change the behavior of the 429 error?
        // Because inside ethers error 429 is handled only by resending the request
        // and in this case no additional node is started. This is a problem for public nodes,
        // so we think it is better to use an additional node in case of 429 error
        const fetchRequest = new FetchRequest(url)

        fetchRequest.setThrottleParams({
          slotInterval: 500,
          maxAttempts: 2,
        })

        fetchRequest.processFunc = async (_, resp) => {
          if (resp.statusCode === 429) {
            // mutate the response to 500 to start an additional node
            // https://github.com/ethers-io/ethers.js/blob/main/src.ts/utils/fetch.ts#L519
            const newResponse = new FetchResponse(500, '', resp.headers, null)

            return newResponse
          }

          return resp
        }

        fetchRequest.retryFunc = async (_, response) => {
          if (response.statusCode === 429) {
            // stop retry attempts
            // https://github.com/ethers-io/ethers.js/blob/main/src.ts/utils/fetch.ts#L556
            return false
          }

          return true
        }

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

  return new JsonRpcProvider(urls)
}


export default createProvider
