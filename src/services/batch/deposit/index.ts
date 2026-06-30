import deposit from './deposit'
import depositEncode from './depositEncode'
import type { DepositBatchInput, ExtractDepositBatch } from './types'


export const createDeposit = (params: StakeWise.CommonParams): ExtractDepositBatch => {
  const result = (values: StakeWise.ExtractInput<DepositBatchInput>) => deposit({ ...params, ...values })
  result.encode = (values: StakeWise.ExtractInput<DepositBatchInput>) => depositEncode({ ...params, ...values })

  return result
}

export type { ExtractDepositBatch } from './types'
