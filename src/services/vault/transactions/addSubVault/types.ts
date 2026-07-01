import type * as z from 'zod/mini'

import { validateSchema } from './validate'


export type AddSubVaultInput = StakeWise.CommonParams & z.input<typeof validateSchema>

export interface ExtractAddSubVaultInput {
  (values: StakeWise.ExtractInput<AddSubVaultInput>): Promise<StakeWise.TransactionHash>
  estimateGas: (values: StakeWise.ExtractInput<AddSubVaultInput>) => Promise<bigint>
  encode: (values: StakeWise.ExtractInput<AddSubVaultInput>) => Promise<StakeWise.TransactionData>
}
