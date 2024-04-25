import type { BaseInput } from '../../../utils'
import ClaimRewardsGas from './ClaimRewardsGas'
import claimRewardsEncode from './claimRewardsEncode'


export type ClaimRewardsInput = BaseInput & {
  assets: bigint
  rewardSplitterAddress: string
}

export interface ClaimRewards {
  (values: ClaimRewardsInput): Promise<StakeWise.TransactionHash>
  estimateGas: typeof ClaimRewardsGas
  encode: typeof claimRewardsEncode
}
