import { JsonRpcProvider, FallbackProvider } from 'ethers'

import getFetchRequest from './getFetchRequest'


const getReadOnlyProvider = (options: StakeWise.Options) => {
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


export default getReadOnlyProvider
