import * as z from 'zod/mini'

import { schema, baseInputSchema } from '../../../../helpers'


export const withdrawSchema = z.extend(baseInputSchema, {
  assets: schema.bigint,
})

export type WithdrawInput = StakeWise.CommonParams & z.input<typeof withdrawSchema>

export interface ExtractWithdraw {
  (values: StakeWise.ExtractInput<WithdrawInput>): Promise<StakeWise.TransactionHash>
  estimateGas: (values: StakeWise.ExtractInput<WithdrawInput>) => Promise<bigint>
  encode: (values: StakeWise.ExtractInput<WithdrawInput>) => Promise<StakeWise.TransactionData>
}
