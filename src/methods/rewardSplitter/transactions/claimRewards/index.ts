import { commonLogic } from './common'
import claimRewardsGas from './claimRewardsGas'
import claimRewardsEncode from './claimRewardsEncode'
import type { ClaimRewards } from './types'
import { rewardSplitterMulticall } from '../../../../contracts'


const claimRewards: ClaimRewards = async (values) => {
  const multicallArgs = await commonLogic(values)

  const result = await rewardSplitterMulticall<{ hash: string }>(multicallArgs)

  return result.hash
}

claimRewards.encode = claimRewardsEncode
claimRewards.estimateGas = claimRewardsGas


export default claimRewards
