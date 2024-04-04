import createRewardSplitterGas from './createRewardSplitterGas'
import createRewardSplitterEncode from './createRewardSplitterEncode'
import { BaseInput } from '../../../utils'


export type CreateRewardSplitterInput = BaseInput

export interface CreateRewardSplitter {
  (values: CreateRewardSplitterInput): Promise<StakeWise.TransactionHash>
  estimateGas: typeof createRewardSplitterGas
  encode: typeof createRewardSplitterEncode
}
