import { Network } from '../enums'
import getReadOnlyProvider from './getReadOnlyProvider'


type CreateProviderInput = {
  network: Network
  rpc: StakeWise.Web3Endpoints
  provider?: StakeWise.Provider
}

const createProvider = (values: CreateProviderInput) => {
  const { network, rpc, provider } = values

  if (provider) {
    return provider
  }

  const createdProvider = getReadOnlyProvider({ network, rpc })
  const originalGetSigner = createdProvider.getSigner

  createdProvider.getSigner = async function (address?: string) {
    try {
      const signer = await originalGetSigner.bind(this)(address)

      return signer
    }
    catch (error) {
      console.error('getSigner err:', error)
      throw new Error('To send this transaction, please provide BrowserProvider to the StakeWiseSDK')
    }
  }

  return createdProvider
}


export default createProvider
