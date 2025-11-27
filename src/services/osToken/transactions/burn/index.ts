import burn from './burn'
import burnGas from './burnGas'
import burnEncode from './burnEncode'
import type { BurnInput, ExtractBurn } from './types'


export const createBurn = (params: StakeWise.CommonParams): ExtractBurn  => {
  const result = (values: StakeWise.ExtractInput<BurnInput>) => burn({ ...params, ...values })
  result.encode = (values: StakeWise.ExtractInput<BurnInput>) => burnEncode({ ...params, ...values })
  result.estimateGas = (values: StakeWise.ExtractInput<BurnInput>) => burnGas({ ...params, ...values })

  return result
}

export type { ExtractBurn } from './types'
