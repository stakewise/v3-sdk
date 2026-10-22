import getMulticallCalls from './getMulticallCalls'
import { sendWithGasMargin } from '../../../helpers'
import { ContractAbi, MulticallParameter } from '../types'


type Input = {
  contract: ContractAbi
  multicallParams: MulticallParameter[]
}

const handleMulticall = async ({ contract, multicallParams }: Input): Promise<unknown> => {
  const calls = getMulticallCalls({ multicallParams, contract })

  const isSoloCall = calls.length === 1

  if (isSoloCall) {
    const { method, args } = multicallParams[0]

    // @ts-ignore: no types to describe
    return sendWithGasMargin(contract[method], args)
  }

  return sendWithGasMargin(contract.multicall, [ calls ])
}


export default handleMulticall
