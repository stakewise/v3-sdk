import * as z from 'zod/mini'

import { schema, baseInputSchema } from '../../../../helpers'


export const ejectSubVaultSchema = z.extend(baseInputSchema, {
  subVaultAddress: schema.ethAddress,
})

export type EjectSubVaultInput = StakeWise.CommonParams & z.input<typeof ejectSubVaultSchema>

export interface ExtractEjectSubVaultInput {
  (values: StakeWise.ExtractInput<EjectSubVaultInput>): Promise<StakeWise.TransactionHash>
  estimateGas: (values: StakeWise.ExtractInput<EjectSubVaultInput>) => Promise<bigint>
  encode: (values: StakeWise.ExtractInput<EjectSubVaultInput>) => Promise<StakeWise.TransactionData>
}
