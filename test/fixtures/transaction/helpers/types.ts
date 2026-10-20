import type { BaseContract } from 'ethers'

import type { MockRunner } from '../../../mockRunner'


export type RecordedTransaction = MockRunner['sent'][number]

export type EncodedTransaction = Partial<StakeWise.TransactionData> & {
  value?: bigint
}

type SendMethod<Input> = {
  (input: Input): Promise<StakeWise.TransactionHash>
  encode: (input: Input) => Promise<EncodedTransaction>
}

type GasMethod<Input> = {
  encode: (input: Input) => Promise<EncodedTransaction>
  estimateGas: (input: Input) => Promise<bigint>
}

type EncodeMethod<Input> = {
  encode: (input: Input) => Promise<EncodedTransaction>
}

export type CheckSendInput<Input> = {
  input: NoInfer<Input>
  method: SendMethod<Input>
}

export type CheckGasInput<Input> = {
  input: NoInfer<Input>
  method: GasMethod<Input>
}

export type EncodedList = Record<string, EncodedTransaction | null>

export type ListMethod<Input, Encoded> = {
  (input: Input): Promise<StakeWise.TransactionHash>
  encode: (input: Input) => Promise<Encoded>
  estimateGas: (input: Input) => Promise<bigint>
}

export type CheckListInput<Input, Encoded extends EncodedList> = {
  input: NoInfer<Input>
  method: ListMethod<Input, Encoded>
  order: Array<keyof NoInfer<Encoded>>
}

export type CheckEncodeInput<Input> = {
  contract: BaseContract
  input: NoInfer<Input>
  method: EncodeMethod<Input>
  calls: Array<{ name: string, args: unknown[] }>
}

export type CheckHarvestInput<Input> = {
  names: string[]
  contract: BaseContract
  input: NoInfer<Input>
  method: EncodeMethod<Input>
}
