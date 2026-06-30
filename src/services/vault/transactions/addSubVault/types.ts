import * as z from 'zod/mini'

import { schema, baseInputSchema } from '../../../../helpers'


export const addSubVaultSchema = z.extend(baseInputSchema, {
  subVaultAddress: schema.ethAddress,
})

export type AddSubVaultInput = StakeWise.CommonParams & z.input<typeof addSubVaultSchema>

export interface ExtractAddSubVaultInput {
  (values: StakeWise.ExtractInput<AddSubVaultInput>): Promise<StakeWise.TransactionHash>
  estimateGas: (values: StakeWise.ExtractInput<AddSubVaultInput>) => Promise<bigint>
  encode: (values: StakeWise.ExtractInput<AddSubVaultInput>) => Promise<StakeWise.TransactionData>
}
