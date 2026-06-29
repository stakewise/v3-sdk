import { parseArgs } from '../../../../helpers'
import { rewardSplitterMulticall } from '../../../../contracts'
import type { RewardSplitterMulticallBaseInput } from '../../../../contracts'

import getSharesFromAssets from './getSharesFromAssets'
import { claimRewardsSchema, type ClaimRewardsInput } from './types'


export const commonLogic = async (values: ClaimRewardsInput) => {
  const { contracts, userAddress, rewardSplitterAddress } = values

  parseArgs(claimRewardsSchema, values)

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
