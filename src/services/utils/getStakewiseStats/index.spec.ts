import { describe, expect } from 'vitest'

import { it, subgraphUrl, gnosisSubgraphUrl } from '../../../../test'

import type { StatsQueryPayload } from '../../../graphql/subgraph/stats'


const resultCases = [
  {
    name: 'returns stats',
    url: subgraphUrl,
    networks: [
      {
        usersCount: 112130,
        totalAssets: '367413495866146342731058',
        totalEarnedAssets: '35975562414044537192074',
      },
    ],
    expected: {
      usersCount: 112130,
      totalAssets: '367413495866146342731058',
      totalEarnedAssets: '35975562414044537192074',
    },
  },
  {
    name: 'gnosis url',
    isGnosis: true,
    url: gnosisSubgraphUrl,
    networks: [
      {
        usersCount: 4817,
        totalAssets: '21936000000000000000000',
        totalEarnedAssets: '1204000000000000000000',
      },
    ],
    expected: {
      usersCount: 4817,
      totalAssets: '21936000000000000000000',
      totalEarnedAssets: '1204000000000000000000',
    },
  },
]

describe('getStakewiseStats', () => {
  it.for(resultCases)('$name', async (resultCase, { sdk, graphql, gnosisSdk }) => {
    const {
      url,
      networks,
      expected,
      isGnosis,
    } = resultCase

    graphql.mock<StatsQueryPayload>({ name: 'Stats', data: { networks } })

    const statsSdk = isGnosis ? gnosisSdk : sdk
    const call = { url, operationName: 'Stats', variables: undefined }

    const result = await statsSdk.utils.getStakewiseStats()

    expect(result).toEqual(expected)
    expect(graphql.calls).toEqual([ expect.objectContaining(call) ])
  })
})
