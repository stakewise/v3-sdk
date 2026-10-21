import type * as z from 'zod/mini'

import { apiUrls, MergedReward, calculateLimit, mergeRewardsFiat } from '../../../../helpers'
import { wrapAbortPromise } from '../../../../modules/gql-module'
import fetchFiatRates from '../../helpers/fetchFiatRates'
import graphql from '../../../../graphql'

import { validate, validateSchema } from './validate'


export type GetStakerRewardsInput = StakeWise.CommonParams & z.input<typeof validateSchema>

const getStakerRewards = async (input: GetStakerRewardsInput): Promise<MergedReward[]> => {
  const { options } = input

  const { dateFrom, dateTo, userAddress } = validate(input)

  const limit = calculateLimit(dateTo, dateFrom)

  if (limit > 1_000) {
    throw new Error('Selected date range exceeds the limit. The maximum allowed span is 1000 days. Please choose a shorter range.')
  }

  const timestampTo = String(dateTo * 1_000)
  const timestampFrom = String(dateFrom * 1_000)

  const [ rewards, fiatRates ] = await Promise.all([
    graphql.subgraph.vault.fetchStakerRewardsQuery({
      url: apiUrls.getSubgraphqlUrl(options),
      variables: {
        limit,
        where: {
          timestamp_lte: timestampTo,
          timestamp_gte: timestampFrom,
          staker_: {
            id: userAddress.toLowerCase(),
          },
        },
      },
      modifyResult: (data) => data?.stakerSnapshots || [],
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


export default wrapAbortPromise<GetStakerRewardsInput, MergedReward[]>(getStakerRewards)
