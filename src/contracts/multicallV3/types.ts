import type { BaseContract, Signer } from 'ethers'


export type MulticallV3Call = {
  contract: BaseContract
  method: string
  args?: readonly unknown[]
  returnName?: string
}

export type MulticallV3Results = Awaited<ReturnType<StakeWise.ABI.Multicall['aggregate3']['staticCall']>>

export type MulticallV3<S extends Signer | undefined = Signer | undefined> =
  <Decoded extends Record<string, unknown> = Record<string, unknown>>(
    calls: MulticallV3Call[]
  ) => Promise<S extends Signer ? string : Decoded>
