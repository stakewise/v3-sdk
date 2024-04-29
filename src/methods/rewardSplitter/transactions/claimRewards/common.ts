import { validateArgs } from '../../../../utils'
import { rewardSplitterMulticall } from '../../../../contracts'
import type { ClaimRewardsInput } from './types'

import getSharesFromAssets from './getSharesFromAssets'


export const commonLogic = async (values: ClaimRewardsInput) => {
  const {
    contracts, userAddress, vaultAddress, options,
    rewardSplitterAddress, assets,
  } = values

  validateArgs.address({ vaultAddress, userAddress, rewardSplitterAddress })
  validateArgs.bigint({ assets })

  const baseMulticall = {
    rewardSplitterContract: contracts.helpers.createRewardSplitter(rewardSplitterAddress),
    keeperContract: contracts.base.keeper,
    vaultAddress,
    userAddress,
    options,
  }

  const shares = await getSharesFromAssets({ assets, vaultAddress, userAddress, options, contracts })
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
