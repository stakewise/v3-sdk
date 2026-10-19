import { makeError } from 'ethers'
import type { BaseContract, Interface } from 'ethers'

import { estimatedGas } from './constants'


type Answer = unknown[] | ((args: any[]) => unknown[])

type RpcAnswer = (params: any[]) => unknown

type FeeData = {
  gasPrice: bigint | null
  maxFeePerGas: bigint | null
  maxPriorityFeePerGas: bigint | null
}

type RecordedTx = {
  to: string
  data: string
  from?: string
  value?: bigint
  gasLimit?: bigint
}

type RecordedRpc = {
  method: string
  params: any[]
}

type Registered = {
  iface: Interface
  answers: Map<string, Answer>
  reverts: Map<string, string>
}

const createRevertError = (errorData: string) => (
  Object.assign(new Error('execution reverted'), { code: 'CALL_EXCEPTION', data: errorData })
)

const createMockRunner = () => {
  const registered = new Map<string, Registered>()
  const rpcAnswers = new Map<string, RpcAnswer>()
  const codes = new Map<string, string>()

  const sent: RecordedTx[] = []
  const calls: RecordedTx[] = []
  const estimated: RecordedTx[] = []
  const rpcCalls: RecordedRpc[] = []
  const waited: string[] = []

  let baseFeePerGas: bigint | null = 1n
  let signingError: Error | null = null
  let feeData: FeeData = { gasPrice: 1n, maxFeePerGas: 2n, maxPriorityFeePerGas: 1n }

  const getEntry = (contract: BaseContract) => {
    const address = String(contract.target).toLowerCase()
    const entry = registered.get(address) || {
      iface: contract.interface,
      answers: new Map(),
      reverts: new Map(),
    }

    registered.set(address, entry)

    return entry
  }

  const on = (contract: BaseContract, methodAnswers: Record<string, Answer>) => {
    const { answers } = getEntry(contract)

    Object.entries(methodAnswers).forEach(([ method, answer ]) => {
      answers.set(contract.interface.getFunction(method)!.selector, answer)
    })
  }

  const revert = (contract: BaseContract, method: string, errorData: string) => {
    getEntry(contract).reverts.set(contract.interface.getFunction(method)!.selector, errorData)
  }

  const answerCall = (to: string, data: string): string => {
    const entry = registered.get(to.toLowerCase())

    if (!entry) {
      throw new Error(`MockRunner: no contract registered at ${to}`)
    }

    const { iface, answers, reverts } = entry
    const fragment = iface.getFunction(data.slice(0, 10))

    if (!fragment) {
      throw new Error(`MockRunner: unknown selector ${data.slice(0, 10)} at ${to}`)
    }

    const revertData = reverts.get(fragment.selector)

    if (revertData) {
      throw createRevertError(revertData)
    }

    const isUnregisteredMulticall = fragment.name === 'multicall' && !answers.has(fragment.selector)

    if (isUnregisteredMulticall) {
      const [ calls ] = iface.decodeFunctionData(fragment, data)
      const results = calls.map((call: string) => answerCall(to, call))

      return iface.encodeFunctionResult(fragment, [ results ])
    }

    const answer = answers.get(fragment.selector)

    if (!answer) {
      throw new Error(`MockRunner: no answer for ${fragment.name} at ${to}`)
    }

    const args = iface.decodeFunctionData(fragment, data)
    const result = typeof answer === 'function' ? answer(args) : answer

    return iface.encodeFunctionResult(fragment, result)
  }

  const toRecorded = (tx: any): RecordedTx => ({
    to: String(tx.to),
    data: tx.data,
    from: tx.from,
    value: tx.value === undefined ? undefined : BigInt(tx.value),
    gasLimit: tx.gasLimit === undefined ? undefined : BigInt(tx.gasLimit),
  })

  const estimateGas = async (tx: any) => {
    const recorded = toRecorded(tx)

    answerCall(recorded.to, recorded.data)
    estimated.push(recorded)

    return estimatedGas
  }

  const call = async (tx: any) => {
    const recorded = toRecorded(tx)
    const result = answerCall(recorded.to, recorded.data)

    calls.push(recorded)

    return result
  }

  const provider: any = {
    call,
    estimateGas,
    getFeeData: async () => feeData,
    getBlock: async () => ({ baseFeePerGas }),
    getCode: async (address: string) => codes.get(address.toLowerCase()) || '0x',
    waitForTransaction: async (hash: string) => {
      waited.push(hash)

      return null
    },
    send: async (method: string, params: any[]) => {
      const answer = rpcAnswers.get(method)

      rpcCalls.push({ method, params })

      if (!answer) {
        throw new Error(`MockRunner: no answer for RPC ${method}`)
      }

      return answer(params)
    },
    getSigner: async (address: string) => ({
      provider,
      getAddress: async () => address,
      call,
      estimateGas: (tx: any) => estimateGas({ ...tx, from: address }),
      sendTransaction: async (tx: any) => {
        answerCall(String(tx.to), tx.data)

        if (signingError) {
          throw signingError
        }

        sent.push(toRecorded({ ...tx, from: address, gasLimit: tx.gasLimit || estimatedGas }))

        return { hash: `0x${String(sent.length).padStart(64, '0')}` }
      },
    }),
  }

  return {
    provider: provider as StakeWise.Provider,
    on,
    revert,
    sent,
    calls,
    estimated,
    waited,
    rpcCalls,
    setCode: (address: string, code: string) => {
      codes.set(address.toLowerCase(), code)
    },
    onRpc: (method: string, answer: RpcAnswer) => {
      rpcAnswers.set(method, answer)
    },
    setFeeData: (values: Partial<FeeData>) => {
      feeData = { ...feeData, ...values }
    },
    setBaseFee: (value: bigint | null) => {
      baseFeePerGas = value
    },
    rejectSigning: () => {
      signingError = makeError('user rejected action', 'ACTION_REJECTED', {
        action: 'sendTransaction',
        reason: 'rejected',
      })
    },
    revertSigning: (errorData: string) => {
      signingError = createRevertError(errorData)
    },
  }
}

export type MockRunner = ReturnType<typeof createMockRunner>


export default createMockRunner
