import type * as z from 'zod/mini'

import { validateSchema } from './validate'
import { UnlockEncodeOutput } from './unlockEncode'


export type UnlockInput = StakeWise.CommonParams & z.input<typeof validateSchema> & {
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
