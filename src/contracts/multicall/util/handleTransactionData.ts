import getMulticallCalls from './getMulticallCalls'
import { ContractAbi, MulticallParameter } from '../types'


type Input = {
  contract: ContractAbi
  multicallParams: MulticallParameter[]
}

const handleTransactionData = async ({ contract, multicallParams }: Input) => {
  const calls = getMulticallCalls({ multicallParams, contract })

  const rx = await contract.multicall.populateTransaction(calls)

  return {
    to: rx.to,
    data: rx.data,
  }
}


export default handleTransactionData
