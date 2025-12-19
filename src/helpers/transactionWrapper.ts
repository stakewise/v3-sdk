/**
 * @description Prevents transaction invocation if provider is not passed to the SDK instance
*/
const transactionWrapper = <T extends unknown>(params: StakeWise.CommonParams, method: T): T => {
  const isReadOnlyProvider = !params.options.provider

  if (isReadOnlyProvider) {
    return (() => {
      throw new Error('To send this transaction, please provide BrowserProvider to the StakeWiseSDK')
    }) as T
  }

  return method
}


export default transactionWrapper
