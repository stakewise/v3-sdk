import getMulticallCalls from './getMulticallCalls'
import { ContractAbi, MulticallParameter } from '../types'


type Input = {
  contract: ContractAbi
  multicallParams: MulticallParameter[]
  userAddress: string
}

// When running callStatic, we want to get result data, but not from these methods
const deleteResultFromMethods = [
  'updateState',
  'swapXdaiToGno',
]

const handleCallStatic = async ({ contract, multicallParams, userAddress }: Input) => {
  const calls = getMulticallCalls({ multicallParams, contract })
  const result = await contract.multicall.staticCall(calls, { from: userAddress })

  const idexesToDeleteResult: number[] = []

  const formattedResult = result.map((data: any, index: number) => {
    const { method } = multicallParams[index]

    if (deleteResultFromMethods.includes(method)) {
      idexesToDeleteResult.push(index)
    }

    // @ts-ignore: TS has limitations when dealing with overloads
    return contract.interface.decodeFunctionResult(method, data)
  })

  return formattedResult.filter((_, index) => !idexesToDeleteResult.includes(index))
}


export default handleCallStatic
