import * as z from 'zod/mini'

import { schema } from '../../../../helpers'


export const rejectSubVaultSchema = z.object({
  userAddress: schema.ethAddress,
  vaultAddress: schema.ethAddress,
  subVaultAddress: schema.ethAddress,
})

export type RejectSubVaultInput = StakeWise.CommonParams & z.input<typeof rejectSubVaultSchema>

export interface ExtractRejectSubVaultInput {
  (values: StakeWise.ExtractInput<RejectSubVaultInput>): Promise<StakeWise.TransactionHash>
  estimateGas: (values: StakeWise.ExtractInput<RejectSubVaultInput>) => Promise<bigint>
  encode: (values: StakeWise.ExtractInput<RejectSubVaultInput>) => Promise<StakeWise.TransactionData>
}
