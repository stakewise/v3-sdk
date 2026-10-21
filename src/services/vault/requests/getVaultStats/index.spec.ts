import { describe, expect } from 'vitest'

import {
  it,
  subgraphUrl,
  vaultAddress,
  mixedCaseVaultAddress,
  lowercaseMixedCaseVaultAddress,
} from '../../../../../test'
import { getDaysCountInvalidCase } from '../../../../../test/mocks/invalidCases'

import type { GetVaultStatsInput } from './index'
import type { VaultStatsQueryPayload } from '../../../../graphql/subgraph/vault'


type Input = StakeWise.ExtractInput<GetVaultStatsInput>

const resultCases = [
  {
    name: 'returns stats',
    vaultStats: [
      {
        apy: '0.9726953598662393882846356361418355',
        timestamp: '1791936000000000',
        totalAssets: '33852384832261116341177',
        earnedAssets: '949592905036300518',
      },
      {
        apy: '2.063265894416142093427864726858956',
        timestamp: '1791849600000000',
        totalAssets: '33851435239356080040659',
        earnedAssets: '2014142985915910634',
      },
      {
        apy: '2.092025499294624598798972434306822',
        timestamp: '1791763200000000',
        totalAssets: '33849421096370164130025',
        earnedAssets: '2042094689375095651',
      },
    ],
    expected: [
      {
        apy: 0.9726953598662393,
        time: 1791936000,
        balance: 33852.384832261116,
        rewards: 0.9495929050363006,
      },
      {
        apy: 2.063265894416142,
        time: 1791849600,
        balance: 33851.43523935608,
        rewards: 2.014142985915911,
      },
      {
        apy: 2.092025499294625,
        time: 1791763200,
        balance: 33849.42109637016,
        rewards: 2.0420946893750958,
      },
    ],
  },
  {
    name: 'no stats',
    vaultStats: [],
    expected: [],
  },
]

const invalidCases = [
  {
    name: 'invalid vault address',
    input: { vaultAddress: '0x123', daysCount: 30 },
    message: 'The "vaultAddress" argument must be a valid address',
  },
  getDaysCountInvalidCase({ vaultAddress }),
]

describe('getVaultStats', () => {
  it.for(resultCases)('$name', async ({ expected, vaultStats }, { sdk, graphql }) => {
    graphql.mock<VaultStatsQueryPayload>({ name: 'VaultStats', data: { vaultStats } })

    const input = { vaultAddress: mixedCaseVaultAddress, daysCount: 30 }
    const variables = { vaultAddress: lowercaseMixedCaseVaultAddress, limit: 30 }

    const result = await sdk.vault.getVaultStats(input)

    expect(result).toEqual(expected)
    expect(graphql.calls).toEqual([
      expect.objectContaining({ url: subgraphUrl, operationName: 'VaultStats', variables }),
    ])
  })

  it.for(invalidCases)('$name', async ({ input, message }, { sdk, graphql }) => {
    const getVaultStats = () => sdk.vault.getVaultStats(input as Input)

    expect(getVaultStats).toThrow(message)
    expect(graphql.calls).toHaveLength(0)
  })
})
