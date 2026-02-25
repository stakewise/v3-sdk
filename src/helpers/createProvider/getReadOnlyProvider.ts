import { JsonRpcProvider, FallbackProvider } from 'ethers'

import { Network } from '../enums'
import getFetchRequest from './getFetchRequest'


type GetReadOnlyProviderInput = {
  network: Network
  rpc: StakeWise.Web3Endpoints
}

const getReadOnlyProvider = (values: GetReadOnlyProviderInput) => {
  const { network, rpc } = values

  const arrayUrls = typeof rpc === 'string' ? [ rpc ] : rpc

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
