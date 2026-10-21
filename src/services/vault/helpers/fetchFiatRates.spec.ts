import { describe, expect } from 'vitest'

import { it, subgraphUrl, gnosisSubgraphUrl } from '../../../../test'

import fetchFiatRates from './fetchFiatRates'
import type { FiatByDayQueryPayload } from '../../../graphql/subgraph/stats'


type Rates = FiatByDayQueryPayload['exchangeRate']

const limit = 2
const timestampTo = '1791936000000000'
const timestampFrom = '1791763200000000'

const variables = {
  limit,
  dateTo: timestampTo,
  dateFrom: timestampFrom,
}

const mainnetRate = {
  usdToEurRate: '0.89',
  usdToGbpRate: '0.75',
  usdToCnyRate: '6.69',
  usdToJpyRate: '158.08',
  usdToKrwRate: '1340.45',
  usdToAudRate: '1.43',
  assetsUsdRate: '2508.04',
}

const mainnetRates: Rates = [
  { ...mainnetRate, timestamp: '1791849600000000' },
  { ...mainnetRate, timestamp: '1791936000000000' },
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

const getRatesAnswer = (url: string, exchangeRate: Rates) => ({ name: 'FiatByDay', url, data: { exchangeRate } })

const getRatesCall = (url: string) => expect.objectContaining({
  url,
  variables,
  operationName: 'FiatByDay',
})

const cases = [
  {
    name: 'mainnet rates',
    answers: [ getRatesAnswer(subgraphUrl, mainnetRates) ],
    calls: [ getRatesCall(subgraphUrl) ],
    expected: mainnetRates,
  },
  {
    name: 'gnosis takes the asset rate from the gnosis subgraph',
    isGnosis: true,
    answers: [
      getRatesAnswer(subgraphUrl, mainnetRates),
      getRatesAnswer(gnosisSubgraphUrl, gnosisRates),
    ],
    calls: [
      getRatesCall(subgraphUrl),
      getRatesCall(gnosisSubgraphUrl),
    ],
    expected: [
      { ...mainnetRates[0], assetsUsdRate: 0 },
      { ...mainnetRates[1], assetsUsdRate: '114.707' },
    ],
  },
  {
    name: 'no rates',
    answers: [ getRatesAnswer(subgraphUrl, []) ],
    calls: [ getRatesCall(subgraphUrl) ],
    expected: [],
  },
]

describe('fetchFiatRates', () => {
  it.for(cases)('$name', async ({ answers, calls, expected, isGnosis }, { sdk, graphql, gnosisSdk }) => {
    answers.forEach((answer) => graphql.mock<FiatByDayQueryPayload>(answer))

    const { options } = (isGnosis ? gnosisSdk : sdk).vault.params

    const result = await fetchFiatRates({
      limit,
      options,
      timestampTo,
      timestampFrom,
    })

    expect(result).toEqual(expected)
    expect(graphql.calls).toEqual(calls)
  })
})
