import getMulticallCalls from './getMulticallCalls'
import { ContractAbi, MulticallParameter } from '../types'


type Input = {
  contract: ContractAbi
  multicallParams: MulticallParameter[]
  userAddress: string
}

const handleCallStatic = async ({ contract, multicallParams, userAddress }: Input) => {
  const calls = getMulticallCalls({ multicallParams, contract })
  const result = await contract.multicall.staticCall(calls, { from: userAddress })

  const formattedResult = result.map((data: any, index: number) => {
    const { method } = multicallParams[index]

    // @ts-ignore: TS has limitations when dealing with overloads
    return contract.interface.decodeFunctionResult(method, data)
  })

  const [ firstResult, ...rest ] = formattedResult

  if (firstResult?.method === 'updateState') {
    return rest
  }

  return formattedResult
}


export default handleCallStatic
