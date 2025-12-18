import getMulticallCalls from './getMulticallCalls'
import { wrapErrorHandler } from '../../../helpers'
import { ContractAbi, MulticallParameter } from '../types'


type Input = {
  contract: ContractAbi
  multicallParams: MulticallParameter[]
}

const handleEstimateGas = async ({ contract, multicallParams }: Input) => {
  const calls = getMulticallCalls({ multicallParams, contract })

  const isSoloCall = calls.length === 1

  if (isSoloCall) {
    const { method, args } = multicallParams[0]

    // @ts-ignore: no types to describe
    return wrapErrorHandler(contract[method].estimateGas(...args), 'gas')
  }

  return wrapErrorHandler(contract.multicall.estimateGas(calls), 'gas')
}


export default handleEstimateGas
