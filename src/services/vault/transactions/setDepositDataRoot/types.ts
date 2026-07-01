import type * as z from 'zod/mini'

import { validateSchema } from './validate'


export type SetDepositDataRootInput = StakeWise.CommonParams & z.input<typeof validateSchema>

export interface ExtractSetDepositDataRoot {
  (values: StakeWise.ExtractInput<SetDepositDataRootInput>): Promise<StakeWise.TransactionHash>
  estimateGas: (values: StakeWise.ExtractInput<SetDepositDataRootInput>) => Promise<bigint>
  encode: (values: StakeWise.ExtractInput<SetDepositDataRootInput>) => Promise<StakeWise.TransactionData>
}
