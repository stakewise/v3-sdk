import { parseEther } from 'ethers'

import { RewardSplitter } from './types'
import type { RewardSplittersQueryPayload } from '../../../../graphql/subgraph/rewardSplitters'


const modifyRewardSplitters = (input: RewardSplittersQueryPayload): RewardSplitter[] => {
  const { rewardSplitters } = input || {}

  if (!rewardSplitters) {
    return []
  }

  return rewardSplitters.map(({ id, owner, totalShares, shareHolders }) => ({
    owner,
    address: id,
    totalPercent: parseEther(totalShares),
    feeRecipients: shareHolders.map(({ shares, address }) => ({
      percent: parseEther(shares),
      address,
    })),
  }))
}


export default modifyRewardSplitters
