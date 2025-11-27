import mint from './mint'
import mintGas from './mintGas'
import mintEncode from './mintEncode'
import type { MintInput, ExtractMint } from './types'


export const createMint = (params: StakeWise.CommonParams): ExtractMint  => {
  const result = (values: StakeWise.ExtractInput<MintInput>) => mint({ ...params, ...values })
  result.encode = (values: StakeWise.ExtractInput<MintInput>) => mintEncode({ ...params, ...values })
  result.estimateGas = (values: StakeWise.ExtractInput<MintInput>) => mintGas({ ...params, ...values })

  return result
}

export type { ExtractMint } from './types'
