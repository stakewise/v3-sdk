const modifyProvider = (provider: StakeWise.Provider) => {
  const originalGetSigner = provider.getSigner

  provider.getSigner = async function (address?: string) {
    const providerError = 'To send this transaction, please provide BrowserProvider to the StakeWiseSDK'

    try {
      const signer = await originalGetSigner.bind(this)(address)

      return signer
    }
    catch (error) {
      console.error('getSigner err:', error)
      throw new Error(providerError)
    }
  }

  return provider
}


export default modifyProvider
