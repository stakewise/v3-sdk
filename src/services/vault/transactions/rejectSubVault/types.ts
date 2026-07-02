import type * as z from 'zod/mini'

import { validateSchema } from './validate'


export type RejectSubVaultInput = StakeWise.CommonParams & z.input<typeof validateSchema>

export interface ExtractRejectSubVaultInput {
  (values: StakeWise.ExtractInput<RejectSubVaultInput>): Promise<StakeWise.TransactionHash>
  estimateGas: (values: StakeWise.ExtractInput<RejectSubVaultInput>) => Promise<bigint>
  encode: (values: StakeWise.ExtractInput<RejectSubVaultInput>) => Promise<StakeWise.TransactionData>
}
