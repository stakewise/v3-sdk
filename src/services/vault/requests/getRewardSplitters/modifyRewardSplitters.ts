import { getAddress } from 'ethers'
import { RewardSplitter } from './types'
import { BigDecimal } from '../../../../helpers'
import type { RewardSplittersQueryPayload } from '../../../../graphql/subgraph/rewardSplitters'


type Output = {
  rewardSplitters: RewardSplitter[]
}

const getPercent = (total: bigint, value: bigint) => {
  const percent = new BigDecimal(100).divide(total).multiply(value).toString()

  return Number(percent)
}

const modifyRewardSplitters = (input: RewardSplittersQueryPayload): Output => {
  const { rewardSplitters } = input || {}

  if (!rewardSplitters) {
    return {
      rewardSplitters: [],
    }
  }

  const modifiedRewardSplitters = rewardSplitters.map((item) => {
    const { id, claimer, owner, version, totalShares, shareHolders } = item

    const totalSharesBI = BigInt(totalShares)

    return {
      owner,
      claimer,
      version: Number(version),
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

  return {
    rewardSplitters: modifiedRewardSplitters,
  }
}


export default modifyRewardSplitters
