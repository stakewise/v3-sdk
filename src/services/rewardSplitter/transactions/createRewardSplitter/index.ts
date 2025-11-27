import createRewardSplitter from './createRewardSplitter'
import createRewardSplitterGas from './createRewardSplitterGas'
import createRewardSplitterEncode from './createRewardSplitterEncode'
import type { CreateRewardSplitterInput, ExtractCreateRewardSplitter } from './types'


export const createRewardSplitterCreator = (params: StakeWise.CommonParams): ExtractCreateRewardSplitter  => {
  const result = (values: StakeWise.ExtractInput<CreateRewardSplitterInput>) => createRewardSplitter({ ...params, ...values })
  result.encode = (values: StakeWise.ExtractInput<CreateRewardSplitterInput>) => createRewardSplitterEncode({ ...params, ...values })
  result.estimateGas = (values: StakeWise.ExtractInput<CreateRewardSplitterInput>) => createRewardSplitterGas({ ...params, ...values })

  return result
}

export type { ExtractCreateRewardSplitter } from './types'
