import addSubVault from './addSubVault'
import addSubVaultGas from './addSubVaultGas'
import addSubVaultEncode from './addSubVaultEncode'
import type { AddSubVaultInput, ExtractAddSubVaultInput } from './types'


export const createAddSubVault = (params: StakeWise.CommonParams): ExtractAddSubVaultInput  => {
  const result = (values: StakeWise.ExtractInput<AddSubVaultInput>) => addSubVault({ ...params, ...values })
  result.encode = (values: StakeWise.ExtractInput<AddSubVaultInput>) => addSubVaultEncode({ ...params, ...values })
  result.estimateGas = (values: StakeWise.ExtractInput<AddSubVaultInput>) => addSubVaultGas({ ...params, ...values })

  return result
}

export type { ExtractAddSubVaultInput } from './types'
