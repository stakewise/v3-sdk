import claimRewards from './claimRewards'
import claimRewardsGas from './claimRewardsGas'
import claimRewardsEncode from './claimRewardsEncode'
import type { ClaimRewardsInput, ExtractClaimRewards } from './types'


export const createClaimRewards = (params: StakeWise.CommonParams): ExtractClaimRewards  => {
  const result = (values: StakeWise.ExtractInput<ClaimRewardsInput>) => claimRewards({ ...params, ...values })
  result.encode = (values: StakeWise.ExtractInput<ClaimRewardsInput>) => claimRewardsEncode({ ...params, ...values })
  result.estimateGas = (values: StakeWise.ExtractInput<ClaimRewardsInput>) => claimRewardsGas({ ...params, ...values })

  return result
}

export type { ExtractClaimRewards } from './types'
