import redeemerWithdraw from './redeemerWithdraw'
import redeemerWithdrawGas from './redeemerWithdrawGas'
import redeemerWithdrawEncode from './redeemerWithdrawEncode'
import type { RedeemerWithdrawInput, ExtractRedeemerWithdraw } from './types'


export const createRedeemerWithdraw = (params: StakeWise.CommonParams): ExtractRedeemerWithdraw => {
  const result = (values: StakeWise.ExtractInput<RedeemerWithdrawInput>) => redeemerWithdraw({ ...params, ...values })
  result.encode = (values: StakeWise.ExtractInput<RedeemerWithdrawInput>) => redeemerWithdrawEncode({ ...params, ...values })
  result.estimateGas = (values: StakeWise.ExtractInput<RedeemerWithdrawInput>) => redeemerWithdrawGas({ ...params, ...values })

  return result
}

export type { ExtractRedeemerWithdraw } from './types'
