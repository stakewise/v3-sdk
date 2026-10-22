import type { ContractTransactionResponse, FunctionFragment } from 'ethers'

import wrapErrorHandler from './wrapErrorHandler'


type ContractMethod = {
  (...args: any[]): Promise<ContractTransactionResponse>
  estimateGas: (...args: any[]) => Promise<bigint>
  getFragment: (...args: any[]) => FunctionFragment
}

const defaultPercent = 10

const sendWithGasMargin = async <M extends ContractMethod>(
  method: M,
  args: Parameters<M['estimateGas']>,
  percent: number = defaultPercent
) => {
  const estimatedGas = await wrapErrorHandler(method.estimateGas(...args), 'gas')
  const gasLimit = estimatedGas * BigInt(100 + percent) / 100n

  // The overrides (e.g. the deposit value) go after the method inputs, the gas limit is added to them
  const { inputs } = method.getFragment(...args)
  const overrides = args[inputs.length] || {}

  return wrapErrorHandler(
    method(
      ...args.slice(0, inputs.length),
      { ...overrides, gasLimit }),
    'transaction'
  )
}


export default sendWithGasMargin
