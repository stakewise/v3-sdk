import type { BaseInput } from '../../../utils'
import claimRewardsGas from './claimRewardsGas'
import claimRewardsEncode from './claimRewardsEncode'


export type ClaimRewardsInput = BaseInput & {
  assets: bigint
  rewardSplitterAddress: string
}

export interface ClaimRewards {
  (values: ClaimRewardsInput): Promise<StakeWise.TransactionHash>
  estimateGas: typeof claimRewardsGas
  encode: typeof claimRewardsEncode
}
