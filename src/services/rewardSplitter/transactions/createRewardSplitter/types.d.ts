import { BaseInput } from '../../../utils'


export type CreateRewardSplitterInput = BaseInput

export interface ExtractCreateRewardSplitter {
  (values: StakeWise.ExtractInput<CreateRewardSplitterInput>): Promise<StakeWise.TransactionHash>
  estimateGas: (values: StakeWise.ExtractInput<CreateRewardSplitterInput>) => Promise<bigint>
  encode: (values: StakeWise.ExtractInput<CreateRewardSplitterInput>) => Promise<StakeWise.TransactionData>
}
