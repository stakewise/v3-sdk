import burnAndWithdraw from './burnAndWithdraw'
import burnAndWithdrawGas from './burnAndWithdrawGas'
import burnAndWithdrawEncode from './burnAndWithdrawEncode'
import type { BurnAndWithdrawInput, ExtractBurnAndWithdraw } from './types'


export const createBurnAndWithdraw = (params: StakeWise.CommonParams): ExtractBurnAndWithdraw => {
  const result = (values: StakeWise.ExtractInput<BurnAndWithdrawInput>) => burnAndWithdraw({ ...params, ...values })
  result.encode = (values: StakeWise.ExtractInput<BurnAndWithdrawInput>) => burnAndWithdrawEncode({ ...params, ...values })
  result.estimateGas = (values: StakeWise.ExtractInput<BurnAndWithdrawInput>) => burnAndWithdrawGas({ ...params, ...values })

  return result
}

export type { ExtractBurnAndWithdraw } from './types'
