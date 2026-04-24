interface TransactionLike {
  (...args: any[]): any
  encode: (...args: any[]) => any
  estimateGas: (...args: any[]) => Promise<bigint>
}

/**
 * @description Prevents transaction invocation if provider is not passed to the SDK instance
*/
const transactionWrapper = <T extends TransactionLike>(params: StakeWise.CommonParams, method: T): T => {
  const isReadOnlyProvider = !params.options.provider

  if (isReadOnlyProvider) {
    const block = () => {
      throw new Error('To send this transaction, please provide BrowserProvider to the StakeWiseSDK')
    }

    const newMethod = block as unknown as T

    newMethod.estimateGas = block as T['estimateGas']
    newMethod.encode = method.encode

    return newMethod
  }

  return method
}


export default transactionWrapper
