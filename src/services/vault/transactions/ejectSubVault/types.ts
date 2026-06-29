import * as z from 'zod/mini'

import { schema } from '../../../../helpers'


export const ejectSubVaultSchema = z.object({
  userAddress: schema.ethAddress,
  vaultAddress: schema.ethAddress,
  subVaultAddress: schema.ethAddress,
})

export type EjectSubVaultInput = StakeWise.CommonParams & z.input<typeof ejectSubVaultSchema>

export interface ExtractEjectSubVaultInput {
  (values: StakeWise.ExtractInput<EjectSubVaultInput>): Promise<StakeWise.TransactionHash>
  estimateGas: (values: StakeWise.ExtractInput<EjectSubVaultInput>) => Promise<bigint>
  encode: (values: StakeWise.ExtractInput<EjectSubVaultInput>) => Promise<StakeWise.TransactionData>
}
