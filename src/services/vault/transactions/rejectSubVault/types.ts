import * as z from 'zod/mini'

import { schema, baseInputSchema } from '../../../../helpers'


export const rejectSubVaultSchema = z.extend(baseInputSchema, {
  subVaultAddress: schema.ethAddress,
})

export type RejectSubVaultInput = StakeWise.CommonParams & z.input<typeof rejectSubVaultSchema>

export interface ExtractRejectSubVaultInput {
  (values: StakeWise.ExtractInput<RejectSubVaultInput>): Promise<StakeWise.TransactionHash>
  estimateGas: (values: StakeWise.ExtractInput<RejectSubVaultInput>) => Promise<bigint>
  encode: (values: StakeWise.ExtractInput<RejectSubVaultInput>) => Promise<StakeWise.TransactionData>
}
