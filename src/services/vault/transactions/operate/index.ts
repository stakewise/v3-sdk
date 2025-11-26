import operate from './operate'
import operateGas from './operateGas'
import operateEncode from './operateEncode'
import type { OperateInput, ExtractOperate } from './types'


export const createOperate = (params: StakeWise.CommonParams): ExtractOperate  => {
  const result = (values: StakeWise.ExtractInput<OperateInput>) => operate({ ...params, ...values })
  result.encode = (values: StakeWise.ExtractInput<OperateInput>) => operateEncode({ ...params, ...values })
  result.estimateGas = (values: StakeWise.ExtractInput<OperateInput>) => operateGas({ ...params, ...values })

  return result
}

export type { ExtractOperate } from './types'
