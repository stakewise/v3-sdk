import updateState from './updateState'
import updateStateGas from './updateStateGas'
import updateStateEncode from './updateStateEncode'
import type { UpdateStateInput, ExtractUpdateStateInput } from './types'


export const createUpdateState = (params: StakeWise.CommonParams): ExtractUpdateStateInput  => {
  const result = (values: StakeWise.ExtractInput<UpdateStateInput>) => updateState({ ...params, ...values })
  result.encode = (values: StakeWise.ExtractInput<UpdateStateInput>) => updateStateEncode({ ...params, ...values })
  result.estimateGas = (values: StakeWise.ExtractInput<UpdateStateInput>) => updateStateGas({ ...params, ...values })

  return result
}

export type { ExtractUpdateStateInput } from './types'
