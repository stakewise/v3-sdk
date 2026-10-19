import { describe, expect } from 'vitest'

import { it, subgraphUrl, gnosisSubgraphUrl } from '../../../../test'

import type { FiatRatesQueryPayload } from '../../../graphql/subgraph/stats'


type Rates = FiatRatesQueryPayload['exchangeRates'][number]

const mainnetRates: Rates = {
  osTokenAssetsRate: '1.081079627402891145',
  assetsUsdRate: '2441.60845396',
  usdToEurRate: '0.8905512512245079704336984593463354',
  usdToGbpRate: '0.7523322299127294613301233824857057',
  usdToCnyRate: '6.691500162068133925290203670528733',
  usdToJpyRate: '157.8721361994493419889363206951426',
  usdToKrwRate: '1336.487443700466434117851462785507',
  usdToAudRate: '1.439677512237258854016700259141952',
  swiseUsdRate: '0.003090856843999986527364941438664395',
  obolUsdRate: '0.002561205081644046073518986761415149',
  ssvUsdRate: '2.631111625603663608016672005940139',
}

const gnosisRates: Rates = {
  osTokenAssetsRate: '1.189412345678901234',
  assetsUsdRate: '114.707',
  usdToEurRate: '0',
  usdToGbpRate: '0',
  usdToCnyRate: '0',
  usdToJpyRate: '0',
  usdToKrwRate: '0',
  usdToAudRate: '0',
  swiseUsdRate: '0',
  obolUsdRate: '0',
  ssvUsdRate: '0',
}

const mainnetAnswer = { name: 'FiatRates', url: subgraphUrl, data: { exchangeRates: [ mainnetRates ] } }
const gnosisAnswer = { name: 'FiatRates', url: gnosisSubgraphUrl, data: { exchangeRates: [ gnosisRates ] } }

const resultCases = [
  {
    name: 'returns rates',
    answers: [ mainnetAnswer ],
    expected: {
      'USD/EUR': 0.890551251224508,
      'USD/GBP': 0.7523322299127294,
      'USD/CNY': 6.691500162068134,
      'USD/JPY': 157.87213619944933,
      'USD/KRW': 1336.4874437004664,
      'USD/AUD': 1.439677512237259,
      'ASSET/USD': 2441.60845396,
      'SSV/USD': 2.6311116256036637,
      'OBOL/USD': 0.002561205081644046,
      'SWISE/USD': 0.0030908568439999866,
      'osToken/USD': 2639.573157670826,
    },
  },
  {
    name: 'gnosis asset rate',
    isGnosis: true,
    answers: [ mainnetAnswer, gnosisAnswer ],
    expected: {
      'USD/EUR': 0.890551251224508,
      'USD/GBP': 0.7523322299127294,
      'USD/CNY': 6.691500162068134,
      'USD/JPY': 157.87213619944933,
      'USD/KRW': 1336.4874437004664,
      'USD/AUD': 1.439677512237259,
      'ASSET/USD': 114.707,
      'SSV/USD': 2.6311116256036637,
      'OBOL/USD': 0.002561205081644046,
      'SWISE/USD': 0.0030908568439999866,
      'osToken/USD': 136.4339219357897,
    },
  },
]

describe('getFiatRates', () => {
  it.for(resultCases)('$name', async ({ answers, expected, isGnosis }, { sdk, graphql, gnosisSdk }) => {
    answers.forEach((answer) => graphql.mock<FiatRatesQueryPayload>(answer))

    const ratesSdk = isGnosis ? gnosisSdk : sdk
    const calls = answers.map(({ url }) => (
      expect.objectContaining({ url, operationName: 'FiatRates', variables: undefined })
    ))

    const result = await ratesSdk.utils.getFiatRates()

    expect(result).toEqual(expected)
    expect(graphql.calls).toEqual(calls)
  })
})
