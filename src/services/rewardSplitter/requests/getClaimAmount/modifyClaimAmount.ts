// eslint-disable-next-line max-len
import { RewardSplitterShareHoldersQueryPayload } from '../../../../graphql/subgraph/rewardSplitters/rewardSplitterShareHoldersQuery.graphql'


type Input = RewardSplitterShareHoldersQueryPayload & {
  rewardSplitterAddress: string
}

type Item = {
  assets: bigint
  address: string
}

type Output = {
  active: Item
  inactive: Array<Item>
}

const modifyQueuePosition = (values: Input): Output => {
  const { selected, other, rewardSplitterAddress } = values

  return {
    active: {
      assets: BigInt(selected[0]?.earnedVaultAssets || 0),
      address: rewardSplitterAddress,
    },
    inactive: other.reduce((acc, item) => {
      const isSelected = item.rewardSplitter.id.toLowerCase() === rewardSplitterAddress.toLowerCase()

      if (isSelected || !item.earnedVaultAssets) {
        return acc
      }

      return [
        ...acc,
        {
          address: item.rewardSplitter.id,
          assets: BigInt(item.earnedVaultAssets),
        },
      ]
    }, [] as Output['inactive']),
  }
}


export default modifyQueuePosition
