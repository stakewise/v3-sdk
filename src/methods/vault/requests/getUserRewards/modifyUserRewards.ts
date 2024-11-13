import type { ModifyUserRewards } from './types'
import { mergeRewardsFiat } from '../../../../utils'
import type { FiatByDayQueryPayload } from '../../../../graphql/subgraph/stats'
import type { UserRewardsQueryPayload } from '../../../../graphql/subgraph/vault'


const modifyUserRewards = (mainnetRates?: FiatByDayQueryPayload['exchangeRate']) => (
  (data: UserRewardsQueryPayload): ModifyUserRewards[] => {
    const boostStats = data?.boost || []
    const allocatorStats = data?.allocator || []
    const exitRequestStats = data?.exitRequest || []
    const rewardSplitterStats = data?.rewardSplitter || []

    const rewards = [
      boostStats,
      allocatorStats,
      exitRequestStats,
      rewardSplitterStats,
    ].flat()

    const exchangeRates = data?.exchangeRates || []

    return mergeRewardsFiat({
      fiatRates: mainnetRates || exchangeRates,
      rewards,
    })
  }
)


export default modifyUserRewards
