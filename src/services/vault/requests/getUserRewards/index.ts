import type * as z from 'zod/mini'

import { apiUrls, MergedReward, calculateLimit, mergeRewardsFiat } from '../../../../helpers'
import { wrapAbortPromise } from '../../../../modules/gql-module'
import fetchFiatRates from '../../helpers/fetchFiatRates'
import graphql from '../../../../graphql'

import { validate, validateSchema } from './validate'


export type GetUserRewardsInput = StakeWise.CommonParams & z.input<typeof validateSchema>

const getUserRewards = async (input: GetUserRewardsInput): Promise<MergedReward[]> => {
  const { options } = input

  const { dateFrom, dateTo, vaultAddress, userAddress } = validate(input)

  const limit = calculateLimit(dateTo, dateFrom)

  if (limit > 1_000) {
    throw new Error('Selected date range exceeds the limit. The maximum allowed span is 1000 days. Please choose a shorter range.')
  }

  const timestampTo = String(dateTo * 1_000)
  const timestampFrom = String(dateFrom * 1_000)

  const [ rewards, fiatRates ] = await Promise.all([
    graphql.subgraph.vault.fetchUserRewardsQuery({
      url: apiUrls.getSubgraphqlUrl(options),
      variables: {
        limit,
        where: {
          timestamp_lte: timestampTo,
          timestamp_gte: timestampFrom,
          allocator_: {
            address: userAddress.toLowerCase(),
            vault: vaultAddress.toLowerCase(),
          },
        },
      },
      modifyResult: (data) => data?.allocator || [],
    }),
    fetchFiatRates({
      limit,
      options,
      timestampTo,
      timestampFrom,
    }),
  ])

  return mergeRewardsFiat({
    rewards,
    fiatRates,
  })
}


export default wrapAbortPromise<GetUserRewardsInput, MergedReward[]>(getUserRewards)
