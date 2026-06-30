import * as z from 'zod/mini'

import {
  schema,
  apiUrls,
  Network,
  configs,
  parseArgs,
  MergedReward,
  baseInputSchema,
  mergeRewardsFiat,
} from '../../../../helpers'
import { wrapAbortPromise } from '../../../../modules/gql-module'
import graphql from '../../../../graphql'


const validateSchema = z.extend(baseInputSchema, {
  dateTo: schema.number,
  dateFrom: schema.number,
})

export type GetUserRewardsInput = StakeWise.CommonParams & z.input<typeof validateSchema>

const calculateLimit = (dateTo: number, dateFrom: number): number => {
  const millisecondsInDay = 1000 * 60 * 60 * 24
  const rawDays = (dateTo - dateFrom) / millisecondsInDay

  return Math.ceil(rawDays)
}

const getUserRewards = async (input: GetUserRewardsInput): Promise<MergedReward[]> => {
  const { options, dateFrom, dateTo, vaultAddress, userAddress } = input

  parseArgs(validateSchema, input)

  const isGnosis = Network.Gnosis === options.network

  const subgraphUrl = apiUrls.getSubgraphqlUrl(options)

  // We can't fetch GPB rates from gnosis subgraph
  const ratesUrl = isGnosis
    ? configs[Network.Mainnet].api.subgraph
    : subgraphUrl

  const limit = calculateLimit(dateTo, dateFrom)

  if (limit > 1_000) {
    throw new Error('Selected date range exceeds the limit. The maximum allowed span is 1000 days. Please choose a shorter range.')
  }

  const timestampTo = String(dateTo * 1_000)
  const timestampFrom = String(dateFrom * 1_000)

  const [ rewards, networkFiatRates, gnosisFiatRates ] = await Promise.all([
    graphql.subgraph.vault.fetchUserRewardsQuery({
      url: subgraphUrl,
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
    graphql.subgraph.stats.fetchFiatByDayQuery({
      url: ratesUrl,
      variables: {
        limit,
        dateTo: timestampTo,
        dateFrom: timestampFrom,
      },
      modifyResult: (data) => data.exchangeRate || [],
    }),
    isGnosis
      ? graphql.subgraph.stats.fetchFiatByDayQuery({
        url: subgraphUrl,
        variables: {
          limit,
          dateTo: timestampTo,
          dateFrom: timestampFrom,
        },
        modifyResult: (data) => (data.exchangeRate || [])
          .reduce((acc, { timestamp, assetsUsdRate }) => ({
            ...acc,
            [timestamp]: assetsUsdRate,
          }), {}),
      })
      : Promise.resolve({}),
  ])

  const fiatRates = isGnosis
    ? networkFiatRates.map((data) => ({
      ...data,
      assetsUsdRate: gnosisFiatRates[data.timestamp as keyof typeof gnosisFiatRates] || 0,
    }))
    : networkFiatRates

  return mergeRewardsFiat({
    rewards,
    fiatRates,
  })
}


export default wrapAbortPromise<GetUserRewardsInput, MergedReward[]>(getUserRewards)
