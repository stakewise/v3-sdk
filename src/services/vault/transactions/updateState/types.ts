export type UpdateStateInput = StakeWise.BaseInput

export interface ExtractUpdateStateInput {
  (values: StakeWise.ExtractInput<UpdateStateInput>): Promise<StakeWise.TransactionHash>
  estimateGas: (values: StakeWise.ExtractInput<UpdateStateInput>) => Promise<bigint>
  encode: (values: StakeWise.ExtractInput<UpdateStateInput>) => Promise<Partial<StakeWise.TransactionData>>
}
