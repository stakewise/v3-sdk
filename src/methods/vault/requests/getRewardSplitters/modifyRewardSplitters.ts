import { getAddress } from 'ethers'
import { RewardSplitter } from './types'
import { BigDecimal } from '../../../../utils'
import type { RewardSplittersQueryPayload } from '../../../../graphql/subgraph/rewardSplitters'


const getPercent = (total: bigint, value: bigint) => {
  const percent = new BigDecimal(100).divide(total).multiply(value).toString()

  return Number(percent)
}

const modifyRewardSplitters = (input: RewardSplittersQueryPayload): RewardSplitter[] => {
  const { rewardSplitters } = input || {}

  if (!rewardSplitters) {
    return []
  }

  return rewardSplitters.map(({ id, owner, totalShares, shareHolders }) => {
    const totalSharesBI = BigInt(totalShares)

    return {
      owner,
      address: getAddress(id),
      totalShares: totalSharesBI,
      feeRecipients: shareHolders.map(({ shares, address }) => {
        const sharesBI = BigInt(shares)

        return {
          shares: sharesBI,
          percent: getPercent(totalSharesBI, sharesBI),
          address: getAddress(address),
        }
      }),
    }
  })
}


export default modifyRewardSplitters
