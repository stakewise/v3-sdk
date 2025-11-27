import setDepositDataRoot from './setDepositDataRoot'
import setDepositDataRootGas from './setDepositDataRootGas'
import setDepositDataRootEncode from './setDepositDataRootEncode'
import type { SetDepositDataRootInput, ExtractSetDepositDataRoot } from './types'


export const createSetDepositDataRoot = (params: StakeWise.CommonParams): ExtractSetDepositDataRoot  => {
  const result = (values: StakeWise.ExtractInput<SetDepositDataRootInput>) => setDepositDataRoot({ ...params, ...values })
  result.encode = (values: StakeWise.ExtractInput<SetDepositDataRootInput>) => setDepositDataRootEncode({ ...params, ...values })
  result.estimateGas = (values: StakeWise.ExtractInput<SetDepositDataRootInput>) => setDepositDataRootGas({ ...params, ...values })

  return result
}

export type { ExtractSetDepositDataRoot } from './types'
