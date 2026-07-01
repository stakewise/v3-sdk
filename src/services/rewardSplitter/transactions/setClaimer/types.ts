import type * as z from 'zod/mini'

import { validateSchema } from './validate'


export type SetClaimerInput = StakeWise.CommonParams & z.input<typeof validateSchema>

export interface ExtractSetClaimer {
  (values: StakeWise.ExtractInput<SetClaimerInput>): Promise<StakeWise.TransactionHash>
  estimateGas: (values: StakeWise.ExtractInput<SetClaimerInput>) => Promise<bigint>
  encode: (values: StakeWise.ExtractInput<SetClaimerInput>) => Promise<StakeWise.TransactionData>
}
