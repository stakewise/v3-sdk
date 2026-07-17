import type * as z from 'zod/mini'

import { validateSchema } from './validate'


export type BurnAndWithdrawInput = StakeWise.CommonParams & z.input<typeof validateSchema>

export interface ExtractBurnAndWithdraw {
  (values: StakeWise.ExtractInput<BurnAndWithdrawInput>): Promise<StakeWise.TransactionHash>
  estimateGas: (values: StakeWise.ExtractInput<BurnAndWithdrawInput>) => Promise<bigint>
  encode: (values: StakeWise.ExtractInput<BurnAndWithdrawInput>) => Promise<StakeWise.TransactionData>
}
