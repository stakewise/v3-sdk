import { validateArgs } from '../../../../helpers'
import type { ClaimRewardsInput } from './types'
import { rewardSplitterMulticall } from '../../../../contracts'
import type { RewardSplitterMulticallBaseInput } from '../../../../contracts'

import getSharesFromAssets from './getSharesFromAssets'


export const commonLogic = async (values: ClaimRewardsInput) => {
  const { contracts, userAddress, vaultAddress, rewardSplitterAddress, assets } = values

  validateArgs.address({ vaultAddress, userAddress, rewardSplitterAddress })
  validateArgs.bigint({ assets })

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
