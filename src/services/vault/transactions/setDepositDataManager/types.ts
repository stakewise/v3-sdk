import type * as z from 'zod/mini'

import { validateSchema } from './validate'


export type SetDepositDataManagerInput = StakeWise.CommonParams & z.input<typeof validateSchema>

export interface ExtractSetDepositDataManager {
  (values: StakeWise.ExtractInput<SetDepositDataManagerInput>): Promise<StakeWise.TransactionHash>
  estimateGas: (values: StakeWise.ExtractInput<SetDepositDataManagerInput>) => Promise<bigint>
  encode: (values: StakeWise.ExtractInput<SetDepositDataManagerInput>) => Promise<StakeWise.TransactionData>
}
