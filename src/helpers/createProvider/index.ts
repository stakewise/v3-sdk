import getReadOnlyProvider from './getReadOnlyProvider'


const createProvider = (options: StakeWise.Options) => {
  if (options.provider) {
    return options.provider
  }

  const createdProvider = getReadOnlyProvider(options)
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
