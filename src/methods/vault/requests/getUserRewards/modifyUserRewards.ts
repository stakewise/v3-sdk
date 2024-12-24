import { mergeRewardsFiat, MergedReward } from '../../../../utils'
import type { FiatByDayQueryPayload } from '../../../../graphql/subgraph/stats'
import type { UserRewardsQueryPayload } from '../../../../graphql/subgraph/vault'


const modifyUserRewards = (mainnetRates?: FiatByDayQueryPayload['exchangeRate']) => (
  (data: UserRewardsQueryPayload): MergedReward[] => {
    const exchangeRates = data?.exchangeRates || []

    return mergeRewardsFiat({
      fiatRates: mainnetRates || exchangeRates,
      rewards: data?.allocator || [],
    })
  }
)


export default modifyUserRewards
