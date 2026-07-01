import type * as z from 'zod/mini'

import { validateSchema } from './validate'


export type EjectSubVaultInput = StakeWise.CommonParams & z.input<typeof validateSchema>

export interface ExtractEjectSubVaultInput {
  (values: StakeWise.ExtractInput<EjectSubVaultInput>): Promise<StakeWise.TransactionHash>
  estimateGas: (values: StakeWise.ExtractInput<EjectSubVaultInput>) => Promise<bigint>
  encode: (values: StakeWise.ExtractInput<EjectSubVaultInput>) => Promise<StakeWise.TransactionData>
}
