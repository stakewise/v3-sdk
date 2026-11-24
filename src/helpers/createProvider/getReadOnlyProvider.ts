import { JsonRpcProvider } from 'ethers'

import { Network } from '../enums'
import getFetchRequest from './getFetchRequest'
import CustomFallbackProvider from './CustomFallbackProvider'


const fallbackTimeoutMs = 10_000

type GetReadOnlyProviderInput = {
  network: Network
  rpc: StakeWise.Web3Endpoints
}

const getReadOnlyProvider = (values: GetReadOnlyProviderInput) => {
  const { network, rpc } = values

  const arrayUrls = typeof rpc === 'string' ? [ rpc ] : rpc

  const providerOptions = { staticNetwork: true }

  if (arrayUrls.length === 1) {
    const fetchRequest = getFetchRequest(arrayUrls[0])

    return new JsonRpcProvider(fetchRequest, network, providerOptions)
  }
  else {
    const providers = arrayUrls.map((url) => {
      const fetchRequest = getFetchRequest(url)

      fetchRequest.timeout = fallbackTimeoutMs
      fetchRequest.preflightFunc = null

      return new JsonRpcProvider(fetchRequest, network, providerOptions)
    })

    return new CustomFallbackProvider(providers, network)
  }
}


export default getReadOnlyProvider
