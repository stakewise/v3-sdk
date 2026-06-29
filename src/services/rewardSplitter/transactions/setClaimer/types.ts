import * as z from 'zod/mini'

import { schema } from '../../../../helpers'


export const setClaimerSchema = z.object({
  userAddress: schema.ethAddress,
  claimerAddress: schema.ethAddress,
  rewardSplitterAddress: schema.ethAddress,
})

export type SetClaimerInput = StakeWise.CommonParams & z.input<typeof setClaimerSchema>

export interface ExtractSetClaimer {
  (values: StakeWise.ExtractInput<SetClaimerInput>): Promise<StakeWise.TransactionHash>
  estimateGas: (values: StakeWise.ExtractInput<SetClaimerInput>) => Promise<bigint>
  encode: (values: StakeWise.ExtractInput<SetClaimerInput>) => Promise<StakeWise.TransactionData>
}
