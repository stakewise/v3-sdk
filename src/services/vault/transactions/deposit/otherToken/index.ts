import deposit from './deposit'
import depositGas from './depositGas'
import depositEncode from './depositEncode'
import type { DepositInput, ExtractDeposit } from '../types'


export const createOtherTokenDeposit = (params: StakeWise.CommonParams): ExtractDeposit  => {
  const result = (values: StakeWise.ExtractInput<DepositInput>) => deposit({ ...params, ...values })
  result.encode = (values: StakeWise.ExtractInput<DepositInput>) => depositEncode({ ...params, ...values })
  result.estimateGas = (values: StakeWise.ExtractInput<DepositInput>) => depositGas({ ...params, ...values })

  return result
}
