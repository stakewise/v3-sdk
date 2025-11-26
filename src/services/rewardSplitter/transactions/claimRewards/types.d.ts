import type { BaseInput } from '../../../utils'


export type ClaimRewardsInput = BaseInput & {
  assets: bigint
  rewardSplitterAddress: string
}

export interface ExtractClaimRewards {
  (values: StakeWise.ExtractInput<ClaimRewardsInput>): Promise<StakeWise.TransactionHash>
  estimateGas: (values: StakeWise.ExtractInput<ClaimRewardsInput>) => Promise<bigint>
  encode: (values: StakeWise.ExtractInput<ClaimRewardsInput>) => Promise<StakeWise.TransactionData>
}
