import type * as z from 'zod/mini'

import { validateSchema } from './validate'


export type ClaimRewardsInput = StakeWise.CommonParams & z.input<typeof validateSchema>

export interface ExtractClaimRewards {
  (values: StakeWise.ExtractInput<ClaimRewardsInput>): Promise<StakeWise.TransactionHash>
  estimateGas: (values: StakeWise.ExtractInput<ClaimRewardsInput>) => Promise<bigint>
  encode: (values: StakeWise.ExtractInput<ClaimRewardsInput>) => Promise<StakeWise.TransactionData>
}
