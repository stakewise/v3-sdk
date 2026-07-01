import { rewardSplitterMulticall } from '../../../../contracts'
import type { RewardSplitterMulticallBaseInput } from '../../../../contracts'

import { validate } from './validate'
import type { ClaimRewardsInput } from './types'
import getSharesFromAssets from './getSharesFromAssets'


export const commonLogic = async (values: ClaimRewardsInput) => {
  const { contracts } = values

  const { userAddress, rewardSplitterAddress } = validate(values)

  const baseMulticall: RewardSplitterMulticallBaseInput = {
    rewardSplitterContract: contracts.helpers.createRewardSplitter(rewardSplitterAddress),
    ...values,
  }

  const shares = await getSharesFromAssets(values)
  const params: Parameters<typeof rewardSplitterMulticall>[0]['request']['params'] = [
    { method: 'syncRewards', args: [] },
    { method: 'enterExitQueue', args: [ shares, userAddress ] },
  ]

  return {
    ...baseMulticall,
    request: {
      params,
    },
  }
}
