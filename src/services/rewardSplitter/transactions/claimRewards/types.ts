import * as z from 'zod/mini'

import { schema, baseInputSchema } from '../../../../helpers'


export const claimRewardsSchema = z.extend(baseInputSchema, {
  assets: schema.bigint,
  rewardSplitterAddress: schema.ethAddress,
})

export type ClaimRewardsInput = StakeWise.CommonParams & z.input<typeof claimRewardsSchema>

export interface ExtractClaimRewards {
  (values: StakeWise.ExtractInput<ClaimRewardsInput>): Promise<StakeWise.TransactionHash>
  estimateGas: (values: StakeWise.ExtractInput<ClaimRewardsInput>) => Promise<bigint>
  encode: (values: StakeWise.ExtractInput<ClaimRewardsInput>) => Promise<StakeWise.TransactionData>
}
