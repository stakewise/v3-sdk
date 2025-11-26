import withdraw from './withdraw'
import withdrawGas from './withdrawGas'
import withdrawEncode from './withdrawEncode'
import type { WithdrawInput, ExtractWithdraw } from './types'


export const createWithdraw = (params: StakeWise.CommonParams): ExtractWithdraw  => {
  const result = (values: StakeWise.ExtractInput<WithdrawInput>) => withdraw({ ...params, ...values })
  result.encode = (values: StakeWise.ExtractInput<WithdrawInput>) => withdrawEncode({ ...params, ...values })
  result.estimateGas = (values: StakeWise.ExtractInput<WithdrawInput>) => withdrawGas({ ...params, ...values })

  return result
}

export type { ExtractWithdraw } from './types'
