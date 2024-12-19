import type { ModifyUserRewards } from './types'
import { mergeRewardsFiat } from '../../../../utils'
import type { FiatByDayQueryPayload } from '../../../../graphql/subgraph/stats'
import type { UserRewardsQueryPayload } from '../../../../graphql/subgraph/vault'


const modifyUserRewards = (mainnetRates?: FiatByDayQueryPayload['exchangeRate']) => (
  (data: UserRewardsQueryPayload): ModifyUserRewards[] => {
    const exchangeRates = data?.exchangeRates || []

    return mergeRewardsFiat({
      fiatRates: mainnetRates || exchangeRates,
      rewards: data?.allocator || [],
    })
  }
)


export default modifyUserRewards
