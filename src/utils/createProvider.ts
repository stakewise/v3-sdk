import { JsonRpcProvider, FallbackProvider } from 'ethers'

import configs from './configs'


const createProvider = (options: StakeWise.Options) => {
  const urls = options.endpoints?.web3

  if (!urls) {
    return new JsonRpcProvider(configs[options.network].network.url)
  }

  if (Array.isArray(urls)) {
    if (urls.length === 1) {
      return new JsonRpcProvider(urls[0])
    }
    else {
      const providers: ConstructorParameters<typeof FallbackProvider>[0] = urls.map((url, index) => ({
        provider: new JsonRpcProvider(url),
        priority: index + 1,
      }))

      const provider = new FallbackProvider(providers) as StakeWise.CustomFallbackProvider

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
