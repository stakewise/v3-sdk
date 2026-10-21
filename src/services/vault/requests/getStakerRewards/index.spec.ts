import { describe, expect } from 'vitest'

import {
  it,
  userAddress,
  subgraphUrl,
  checksumAddress,
  gnosisSubgraphUrl,
  lowercaseChecksumAddress,
} from '../../../../../test'
import { mainnetFiatRates } from '../../../../../test/mocks/fiatRates'

import type { GetStakerRewardsInput } from './index'
import type { FiatByDayQueryPayload } from '../../../../graphql/subgraph/stats'
import type { StakerRewardsQueryPayload } from '../../../../graphql/subgraph/vault'


type Input = StakeWise.ExtractInput<GetStakerRewardsInput>
type Rates = FiatByDayQueryPayload['exchangeRate']

const dateTo = 1791936000000
const timestampTo = '1791936000000000'

const shortRange = {
  limit: 2,
  dateFrom: 1791763200000,
  timestampFrom: '1791763200000000',
}

const maxRange = {
  limit: 1_000,
  dateFrom: 1705536000000,
  timestampFrom: '1705536000000000',
}

const stakerSnapshots: StakerRewardsQueryPayload['stakerSnapshots'] = [
  {
    timestamp: '1791936000000000',
    earnedAssets: '592780367632635',
  },
  {
    timestamp: '1791849600000000',
    earnedAssets: '1325625192342154',
  },
]

const gnosisRates: Rates = [
  {
    timestamp: '1791936000000000',
    usdToEurRate: '0',
    usdToGbpRate: '0',
    usdToCnyRate: '0',
    usdToJpyRate: '0',
    usdToKrwRate: '0',
    usdToAudRate: '0',
    assetsUsdRate: '114.707',
  },
]

const ratedRewards = [
  {
    date: 1791849600000,
    dailyRewards: 0.001325625192342154,
    dailyStakeRewards: 0,
    dailyBoostRewards: 0,
    dailyRewardsUsd: 3.3244465267370398,
    dailyRewardsEur: 2.967990828262691,
    dailyRewardsGbp: 2.5110535164280754,
    dailyRewardsCny: 22.249190976668793,
    dailyRewardsJpy: 526.2540032414792,
    dailyRewardsKrw: 4458.5739934512285,
    dailyRewardsAud: 4.760498506081621,
  },
  {
    date: 1791936000000,
    dailyRewards: 0.000592780367632635,
    dailyStakeRewards: 0,
    dailyBoostRewards: 0,
    dailyRewardsUsd: 1.4276992382741625,
    dailyRewardsEur: 1.2776460928942028,
    dailyRewardsGbp: 1.0821642069841297,
    dailyRewardsCny: 9.555591076398136,
    dailyRewardsJpy: 225.68359359450952,
    dailyRewardsKrw: 1914.3961788140614,
    dailyRewardsAud: 2.0479376284163333,
  },
]

const gnosisRewards = [
  {
    date: 1791849600000,
    dailyRewards: 0.001325625192342154,
    dailyStakeRewards: 0,
    dailyBoostRewards: 0,
    dailyRewardsUsd: 0,
    dailyRewardsEur: 0,
    dailyRewardsGbp: 0,
    dailyRewardsCny: 0,
    dailyRewardsJpy: 0,
    dailyRewardsKrw: 0,
    dailyRewardsAud: 0,
  },
  {
    date: 1791936000000,
    dailyRewards: 0.000592780367632635,
    dailyStakeRewards: 0,
    dailyBoostRewards: 0,
    dailyRewardsUsd: 0.06799605763003665,
    dailyRewardsEur: 0.060849578842839376,
    dailyRewardsGbp: 0.05153949642237296,
    dailyRewardsCny: 0.45509761727214765,
    dailyRewardsJpy: 10.748478548434448,
    dailyRewardsKrw: 91.17564078742326,
    dailyRewardsAud: 0.09753572830426693,
  },
]

const getRatesAnswer = (url: string, exchangeRate: Rates) => ({ name: 'FiatByDay', url, data: { exchangeRate } })

const emptyAnswer = getRatesAnswer(subgraphUrl, [])
const gnosisAnswer = getRatesAnswer(gnosisSubgraphUrl, gnosisRates)
const mainnetAnswer = getRatesAnswer(subgraphUrl, mainnetFiatRates)

const resultCases = [
  {
    name: 'returns rewards',
    url: subgraphUrl,
    range: shortRange,
    snapshots: stakerSnapshots,
    rates: [ mainnetAnswer ],
    expected: ratedRewards,
  },
  {
    name: 'no rewards',
    url: subgraphUrl,
    range: maxRange,
    snapshots: [],
    rates: [ emptyAnswer ],
    expected: [],
  },
  {
    name: 'gnosis rates',
    url: gnosisSubgraphUrl,
    isGnosis: true,
    range: shortRange,
    snapshots: stakerSnapshots,
    rates: [ mainnetAnswer, gnosisAnswer ],
    expected: gnosisRewards,
  },
]

const baseInput = {
  dateTo,
  userAddress,
  dateFrom: shortRange.dateFrom,
}

const errorCases = [
  {
    name: 'invalid user address',
    input: { ...baseInput, userAddress: '0x123' },
    message: 'The "userAddress" argument must be a valid address',
  },
  {
    name: 'missing date from',
    input: { userAddress, dateTo },
    message: 'The "dateFrom" argument',
  },
  {
    name: 'missing date to',
    input: { userAddress, dateFrom: shortRange.dateFrom },
    message: 'The "dateTo" argument',
  },
  {
    name: 'range above limit',
    input: { ...baseInput, dateFrom: maxRange.dateFrom - 1 },
    message: 'Selected date range exceeds the limit',
  },
  {
    name: 'inverted range',
    input: { ...baseInput, dateTo: baseInput.dateFrom - 1 },
    message: 'The "dateFrom" argument must be less than or equal to "dateTo"',
  },
]

describe('getStakerRewards', () => {
  it.for(resultCases)('$name', async (resultCase, { sdk, graphql, gnosisSdk }) => {
    const {
      url,
      range,
      rates,
      expected,
      isGnosis,
      snapshots,
    } = resultCase

    graphql.mock<StakerRewardsQueryPayload>({ name: 'StakerRewards', data: { stakerSnapshots: snapshots } })
    rates.forEach((answer) => graphql.mock<FiatByDayQueryPayload>(answer))

    const rewardsSdk = isGnosis ? gnosisSdk : sdk
    const input = {
      dateTo,
      dateFrom: range.dateFrom,
      userAddress: checksumAddress,
    }
    const rewardsCall = {
      url,
      operationName: 'StakerRewards',
      variables: {
        limit: range.limit,
        where: {
          timestamp_lte: timestampTo,
          timestamp_gte: range.timestampFrom,
          staker_: {
            id: lowercaseChecksumAddress,
          },
        },
      },
    }
    const ratesVariables = {
      limit: range.limit,
      dateTo: timestampTo,
      dateFrom: range.timestampFrom,
    }
    const ratesCalls = rates.map((answer) => ({
      url: answer.url,
      operationName: 'FiatByDay',
      variables: ratesVariables,
    }))
    const calls = [ rewardsCall, ...ratesCalls ].map((call) => expect.objectContaining(call))

    const result = await rewardsSdk.vault.getStakerRewards(input)

    expect(result).toEqual(expected)
    expect(graphql.calls).toEqual(calls)
  })

  it.for(errorCases)('$name', async ({ input, message }, { sdk, graphql }) => {
    const request = sdk.vault.getStakerRewards(input as Input)

    await expect(request).rejects.toThrow(message)
    expect(graphql.calls).toHaveLength(0)
  })
})
