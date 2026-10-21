import { describe, expect } from 'vitest'

import { it, subgraphUrl, gnosisSubgraphUrl } from '../../../../test'
import { mainnetFiatRates } from '../../../../test/mocks/fiatRates'

import type { FiatByDayQueryPayload } from '../../../graphql/subgraph/stats'


const dateTo = 1791936000000
const dateFrom = 1791763200000

const variables = { limit: 2, dateTo: '1791936000000000', dateFrom: '1791763200000000' }

const zeroFiat = {
  usdToEurRate: '0',
  usdToGbpRate: '0',
  usdToCnyRate: '0',
  usdToJpyRate: '0',
  usdToKrwRate: '0',
  usdToAudRate: '0',
}

const gnosisRates: FiatByDayQueryPayload['exchangeRate'] = [
  { ...zeroFiat, timestamp: '1791936000000000', assetsUsdRate: '114.707' },
  { ...zeroFiat, timestamp: '1791849600000000', assetsUsdRate: '118.52' },
]

const mainnetAnswer = { name: 'FiatByDay', url: subgraphUrl, data: { exchangeRate: mainnetFiatRates } }
const gnosisAnswer = { name: 'FiatByDay', url: gnosisSubgraphUrl, data: { exchangeRate: gnosisRates } }

const resultCases = [
  {
    name: 'returns rates',
    answers: [ mainnetAnswer ],
    expected: mainnetFiatRates,
  },
  {
    name: 'gnosis asset rate',
    isGnosis: true,
    answers: [ mainnetAnswer, gnosisAnswer ],
    expected: [
      { ...mainnetFiatRates[0], assetsUsdRate: '114.707' },
      { ...mainnetFiatRates[1], assetsUsdRate: '118.52' },
    ],
  },
]

describe('getFiatRatesByDay', () => {
  it.for(resultCases)('$name', async ({ answers, expected, isGnosis }, { sdk, graphql, gnosisSdk }) => {
    answers.forEach((answer) => graphql.mock<FiatByDayQueryPayload>(answer))

    const ratesSdk = isGnosis ? gnosisSdk : sdk
    const calls = answers.map(({ url }) => (
      expect.objectContaining({ url, operationName: 'FiatByDay', variables })
    ))

    const result = await ratesSdk.utils.getFiatRatesByDay({ dateTo, dateFrom })

    expect(result).toEqual(expected)
    expect(graphql.calls).toEqual(calls)
  })

  it('inverted range', async ({ sdk, graphql }) => {
    const request = sdk.utils.getFiatRatesByDay({ dateTo: dateFrom, dateFrom: dateTo })

    await expect(request).rejects.toThrow('The "dateFrom" argument must be less than or equal to "dateTo"')
    expect(graphql.calls).toHaveLength(0)
  })
})
