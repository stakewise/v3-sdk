import type { BaseContract, ContractTransactionResponse, Signer } from 'ethers'


export type MulticallV3Call = {
  contract: BaseContract
  method: string
  args?: readonly unknown[]
  returnName?: string
}

export type MulticallV3Results = Awaited<ReturnType<StakeWise.ABI.Multicall['aggregate3']['staticCall']>>

export type MulticallV3Decoded<T extends readonly MulticallV3Call[]> = {
  [K in T[number] as K extends { returnName: infer N extends string } ? N : never]: any
}

export type MulticallV3<S extends Signer | undefined = Signer | undefined> =
  <const T extends readonly MulticallV3Call[]>(
    calls: T
  ) => Promise<S extends Signer ? ContractTransactionResponse : MulticallV3Decoded<T>>
