import rejectSubVault from './rejectSubVault'
import rejectSubVaultGas from './rejectSubVaultGas'
import rejectSubVaultEncode from './rejectSubVaultEncode'
import type { RejectSubVaultInput, ExtractRejectSubVaultInput } from './types'


export const createRejectSubVault = (params: StakeWise.CommonParams): ExtractRejectSubVaultInput  => {
  const result = (values: StakeWise.ExtractInput<RejectSubVaultInput>) => rejectSubVault({ ...params, ...values })
  result.encode = (values: StakeWise.ExtractInput<RejectSubVaultInput>) => rejectSubVaultEncode({ ...params, ...values })
  result.estimateGas = (values: StakeWise.ExtractInput<RejectSubVaultInput>) => rejectSubVaultGas({ ...params, ...values })

  return result
}

export type { ExtractRejectSubVaultInput } from './types'
