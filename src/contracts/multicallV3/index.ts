import type { Signer } from 'ethers'

import decodeRevert from './decodeRevert'
import type { MulticallV3, MulticallV3Call } from './types'


const createMulticallV3 = <S extends Signer | undefined = undefined>(
  multicallContract: StakeWise.ABI.Multicall,
  signer?: S
): MulticallV3<S> => {
  return (async (calls: MulticallV3Call[]) => {
    if (!calls.length) {
      throw new Error('createMulticallV3: empty batch')
    }

    const encoded = await Promise.all(calls.map(async (call) => ({
      callData: call.contract.interface.encodeFunctionData(call.method, call.args || []),
      target: await call.contract.getAddress(),
      allowFailure: false,
    })))

    const contract = signer ? multicallContract.connect(signer) : multicallContract

    const results = await contract.aggregate3.staticCall(
      encoded.map((call) => ({ ...call, allowFailure: true }))
    )

    const failed = results.reduce<string[]>((acc, result, index) => {
      if (!result.success) {
        const { method } = calls[index]
        const { target } = encoded[index]

        acc.push(`[${index}] ${method} @ ${target}: ${decodeRevert(calls[index], result.returnData)}`)
      }

      return acc
    }, [])

    if (failed.length) {
      throw new Error(`Multicall batch failed:\n${failed.join('\n')}`)
    }

    if (signer) {
      const { hash } = await contract.aggregate3(encoded)

      return hash
    }

    return calls.reduce<Record<string, unknown>>((acc, call, index) => {
      const { contract, method, returnName } = call

      if (!returnName) {
        return acc
      }

      if (acc[returnName]) {
        throw new Error(`createMulticallV3: duplicate returnName "${returnName}"`)
      }

      const values = contract.interface.decodeFunctionResult(method, results[index].returnData)

      acc[returnName] = values.length === 1 ? values[0] : values

      return acc
    }, {})
  }) as MulticallV3<S>
}


export default createMulticallV3
