import setDepositDataManager from './setDepositDataManager'
import setDepositDataManagerGas from './setDepositDataManagerGas'
import setDepositDataManagerEncode from './setDepositDataManagerEncode'
import type { SetDepositDataManagerInput, ExtractSetDepositDataManager } from './types'


export const createSetDepositDataManager = (params: StakeWise.CommonParams): ExtractSetDepositDataManager  => {
  const result = (values: StakeWise.ExtractInput<SetDepositDataManagerInput>) => setDepositDataManager({ ...params, ...values })
  result.encode = (values: StakeWise.ExtractInput<SetDepositDataManagerInput>) => setDepositDataManagerEncode({ ...params, ...values })
  result.estimateGas = (values: StakeWise.ExtractInput<SetDepositDataManagerInput>) => setDepositDataManagerGas({ ...params, ...values })

  return result
}

export type { ExtractSetDepositDataManager } from './types'
