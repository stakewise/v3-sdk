import getMulticallCalls from './getMulticallCalls'
import { ContractAbi, MulticallParameter } from '../types'


type Input = {
  contract: ContractAbi
  multicallParams: MulticallParameter[]
}

const handleTransactionData = async ({ contract, multicallParams }: Input) => {
  const calls = getMulticallCalls({ multicallParams, contract })

  return contract.multicall.populateTransaction(calls)
}


export default handleTransactionData
