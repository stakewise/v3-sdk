import depositAndMint from './depositAndMint'
import depositAndMintGas from './depositAndMintGas'
import depositAndMintEncode from './depositAndMintEncode'
import type { DepositAndMintInput, ExtractDepositAndMint } from '../types'


export const createNativeTokenDepositAndMint = (params: StakeWise.CommonParams): ExtractDepositAndMint => {
  const result = (values: StakeWise.ExtractInput<DepositAndMintInput>) => depositAndMint({ ...params, ...values })
  result.encode = (values: StakeWise.ExtractInput<DepositAndMintInput>) => depositAndMintEncode({ ...params, ...values })
  result.estimateGas = (values: StakeWise.ExtractInput<DepositAndMintInput>) => depositAndMintGas({ ...params, ...values })

  return result
}
