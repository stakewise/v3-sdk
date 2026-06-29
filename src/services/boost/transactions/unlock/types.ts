import * as z from 'zod/mini'

import { schema, baseInputSchema } from '../../../../helpers'
import { UnlockEncodeOutput } from './unlockEncode'


export const unlockSchema = z.extend(baseInputSchema, {
  percent: schema.number,
})

export type UnlockInput = StakeWise.CommonParams & z.input<typeof unlockSchema> & {
  leverageStrategyData?: {
    version: number
    isUpgradeRequired: boolean
  }
}

export interface ExtractUnlock {
  (values: StakeWise.ExtractInput<UnlockInput>): Promise<StakeWise.TransactionHash>
  estimateGas: (values: StakeWise.ExtractInput<UnlockInput>) => Promise<bigint>
  encode: (values: StakeWise.ExtractInput<UnlockInput>) => Promise<UnlockEncodeOutput>
}
