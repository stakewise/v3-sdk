import { commonLogic } from './common'
import type { ClaimRewardsInput } from './types'
import { rewardSplitterMulticall } from '../../../../contracts'


const claimRewards = async (values: ClaimRewardsInput) => {
  const multicallArgs = await commonLogic(values)

  const result = await rewardSplitterMulticall<{ hash: string }>(multicallArgs)

  return result.hash
}


export default claimRewards
