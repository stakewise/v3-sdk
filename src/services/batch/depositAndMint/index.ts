import depositAndMint from './depositAndMint'
import depositAndMintEncode from './depositAndMintEncode'
import type { DepositAndMintBatchInput, ExtractDepositAndMintBatch } from './types'


export const createDepositAndMint = (params: StakeWise.CommonParams): ExtractDepositAndMintBatch => {
  const result = (values: StakeWise.ExtractInput<DepositAndMintBatchInput>) => depositAndMint({ ...params, ...values })
  result.encode = (values: StakeWise.ExtractInput<DepositAndMintBatchInput>) => depositAndMintEncode({ ...params, ...values })

  return result
}

export type { ExtractDepositAndMintBatch } from './types'
