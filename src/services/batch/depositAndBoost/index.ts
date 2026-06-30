import depositAndBoost from './depositAndBoost'
import depositAndBoostEncode from './depositAndBoostEncode'
import type { DepositAndBoostInput, ExtractDepositAndBoostBatch } from './types'


export const createDepositAndBoost = (params: StakeWise.CommonParams): ExtractDepositAndBoostBatch => {
  const result = (values: StakeWise.ExtractInput<DepositAndBoostInput>) => depositAndBoost({ ...params, ...values })
  result.encode = (values: StakeWise.ExtractInput<DepositAndBoostInput>) => depositAndBoostEncode({ ...params, ...values })

  return result
}

export type { ExtractDepositAndBoostBatch } from './types'
