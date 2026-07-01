import type * as z from 'zod/mini'

import { validateSchema } from './validate'


export type WithdrawInput = StakeWise.CommonParams & z.input<typeof validateSchema>

export interface ExtractWithdraw {
  (values: StakeWise.ExtractInput<WithdrawInput>): Promise<StakeWise.TransactionHash>
  estimateGas: (values: StakeWise.ExtractInput<WithdrawInput>) => Promise<bigint>
  encode: (values: StakeWise.ExtractInput<WithdrawInput>) => Promise<StakeWise.TransactionData>
}
