import getMulticallCalls from './getMulticallCalls'
import { ContractAbi, MulticallParameter } from '../types'


type Input = {
  contract: ContractAbi
  multicallParams: MulticallParameter[]
}

const handleTransactionData = async ({ contract, multicallParams }: Input) => {
  const calls = getMulticallCalls({ multicallParams, contract })

  const isSoloCall = calls.length === 1

  if (isSoloCall) {
    const { method, args } = multicallParams[0]

    // @ts-ignore: no types to describe
    return contract[method].populateTransaction(...args)
  }

  return contract.multicall.populateTransaction(calls)
}


export default handleTransactionData
