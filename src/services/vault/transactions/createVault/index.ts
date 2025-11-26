import createVault from './createVault'
import createVaultGas from './createVaultGas'
import createVaultEncode from './createVaultEncode'
import type { CreateVaultInput, ExtractCreateVault } from './types'


export const createVaultCreator = (params: StakeWise.CommonParams): ExtractCreateVault  => {
  const result = (values: StakeWise.ExtractInput<CreateVaultInput>) => createVault({ ...params, ...values })
  result.encode = (values: StakeWise.ExtractInput<CreateVaultInput>) => createVaultEncode({ ...params, ...values })
  result.estimateGas = (values: StakeWise.ExtractInput<CreateVaultInput>) => createVaultGas({ ...params, ...values })

  return result
}

export type { ExtractCreateVault } from './types'
