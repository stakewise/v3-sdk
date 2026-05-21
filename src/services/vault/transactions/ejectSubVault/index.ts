import ejectSubVault from './ejectSubVault'
import ejectSubVaultGas from './ejectSubVaultGas'
import ejectSubVaultEncode from './ejectSubVaultEncode'
import type { EjectSubVaultInput, ExtractEjectSubVaultInput } from './types'


export const createEjectSubVault = (params: StakeWise.CommonParams): ExtractEjectSubVaultInput  => {
  const result = (values: StakeWise.ExtractInput<EjectSubVaultInput>) => ejectSubVault({ ...params, ...values })
  result.encode = (values: StakeWise.ExtractInput<EjectSubVaultInput>) => ejectSubVaultEncode({ ...params, ...values })
  result.estimateGas = (values: StakeWise.ExtractInput<EjectSubVaultInput>) => ejectSubVaultGas({ ...params, ...values })

  return result
}

export type { ExtractEjectSubVaultInput } from './types'
