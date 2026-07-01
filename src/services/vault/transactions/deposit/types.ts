import type * as z from 'zod/mini'

import { validateSchema } from './validate'


export type DepositInput = StakeWise.CommonParams & z.input<typeof validateSchema>

export interface ExtractDeposit {
  (values: StakeWise.ExtractInput<DepositInput>): Promise<StakeWise.TransactionHash>
  estimateGas: (values: StakeWise.ExtractInput<DepositInput>) => Promise<bigint>
  encode: (values: StakeWise.ExtractInput<DepositInput>) => Promise<StakeWise.TransactionData>
}
