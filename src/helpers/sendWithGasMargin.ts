import type { ContractTransactionResponse, FunctionFragment } from 'ethers'

import wrapErrorHandler from './wrapErrorHandler'


type ContractMethod = {
  (...args: any[]): Promise<ContractTransactionResponse>
  estimateGas: (...args: any[]) => Promise<bigint>
  getFragment: (...args: any[]) => FunctionFragment
}

const defaultPercent = 10n

/**
 * Sends a contract method with a gas limit of the estimate plus `percent` (10% by default).
 * Errors of the estimate and of the send are wrapped into ContractError.
 */
const sendWithGasMargin = async <M extends ContractMethod>(
  method: M,
  args: Parameters<M['estimateGas']>,
  percent: bigint = defaultPercent
) => {
  const estimatedGas = await wrapErrorHandler(method.estimateGas(...args), 'gas')
  const gasLimit = estimatedGas * (100n + percent) / 100n

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
