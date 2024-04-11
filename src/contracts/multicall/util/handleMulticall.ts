import getMulticallCalls from './getMulticallCalls'
import { ContractAbi, MulticallParameter } from '../types'


type Input = {
  contract: ContractAbi
  multicallParams: MulticallParameter[]
}

const handleMulticall = async ({ contract, multicallParams }: Input) => {
  const calls = getMulticallCalls({ multicallParams, contract })

  const isSoloCall = calls.length === 1

  // Even though ethers tries to find the best price for gas, sometimes it's
  // not enough and the transaction breaks down and users lose money for gas.
  // Adding 10% to the gas limit
  if (isSoloCall) {
    const { method, args } = multicallParams[0]

    // @ts-ignore: no types to describe
    const estimatedGas = await contract[method].estimateGas(...args)
    const gasLimit = estimatedGas * 110n / 100n

    // @ts-ignore: no types to describe
    return contract[method](...args, { gasLimit })
  }

  const estimatedGas = await contract.multicall.estimateGas(calls)
  const gasLimit = estimatedGas * 110n / 100n

  return contract.multicall(calls, { gasLimit })
}


export default handleMulticall
