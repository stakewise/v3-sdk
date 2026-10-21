import { describe, expect } from 'vitest'

import {
  it,
  userAddress,
  subgraphUrl,
  vaultAddress,
  checksumAddress,
  mixedCaseVaultAddress,
  lowercaseChecksumAddress,
  lowercaseMixedCaseVaultAddress,
} from '../../../../../test'
import { latestRewardSnapshot } from '../../../../../test/mocks/userRewards'
import { baseInputWiringCase, getDaysCountInvalidCase } from '../../../../../test/mocks/invalidCases'

import type { GetUserStatsInput } from './index'
import type { UserRewardsQueryPayload } from '../../../../graphql/subgraph/vault'


type Input = StakeWise.ExtractInput<GetUserStatsInput>

const daysCount = 4
const now = 1792152000 * 1_000

const resultCases = [
  {
    name: 'returns stats',
    allocator: [
      latestRewardSnapshot,
      {
        apy: '11.67565137786503340889967455230663',
        timestamp: '1791763200000000',
        totalAssets: '4201857871751008802',
        earnedAssets: '1344025882013568',
        boostEarnedAssets: '1131364821220163',
        stakeEarnedAssets: '212661060793405',
      },
      {
        apy: '11.24199014845460254202669069248913',
        timestamp: '1791676800000000',
        totalAssets: '4201645210690215397',
        earnedAssets: '1294042527177803',
        boostEarnedAssets: '1089290178113408',
        stakeEarnedAssets: '204752349064395',
      },
    ],
    expected: {
      apy: [
        { value: 11.675651377865034, time: 1791763200 },
        { value: 0, time: 1791849600 },
        { value: 5.149048319054803, time: 1791936000 },
        { value: 0, time: 1792022400 },
      ],
      balance: [
        { value: 4.201857871751009, time: 1791763200 },
        { value: 0, time: 1791849600 },
        { value: 4.202134309351964, time: 1791936000 },
        { value: 0, time: 1792022400 },
      ],
      rewards: [
        {
          value: 0.001344025882013568,
          time: 1791763200,
          extraData: { boostRewards: 0.001131364821220163, stakeRewards: 0.000212661060793405 },
        },
        {
          value: 0,
          time: 1791849600,
          extraData: { boostRewards: 0, stakeRewards: 0 },
        },
        {
          value: 0.000592780367632635,
          time: 1791936000,
          extraData: { boostRewards: 0.000498746868467053, stakeRewards: 0.000094033499165582 },
        },
        {
          value: 0,
          time: 1792022400,
          extraData: { boostRewards: 0, stakeRewards: 0 },
        },
      ],
    },
  },
  {
    name: 'new user',
    allocator: [],
    expected: { apy: [], balance: [], rewards: [] },
  },
]

const invalidCases = [
  baseInputWiringCase,
  getDaysCountInvalidCase({ vaultAddress, userAddress }),
]

describe('getUserStats', () => {
  it.beforeEach(({ clock }) => {
    clock.setSystemTime(now)
  })

  it.for(resultCases)('$name', async ({ expected, allocator }, { sdk, graphql }) => {
    graphql.mock<UserRewardsQueryPayload>({ name: 'UserRewards', data: { allocator } })

    const input = { vaultAddress: mixedCaseVaultAddress, userAddress: checksumAddress, daysCount }
    const variables = {
      limit: daysCount,
      where: {
        allocator_: {
          vault: lowercaseMixedCaseVaultAddress,
          address: lowercaseChecksumAddress,
        },
      },
    }

    const result = await sdk.vault.getUserStats(input)

    expect(result).toEqual(expected)
    expect(graphql.calls).toEqual([
      expect.objectContaining({ url: subgraphUrl, operationName: 'UserRewards', variables }),
    ])
  })

  it.for(invalidCases)('$name', async ({ input, message }, { sdk, graphql }) => {
    const getUserStats = () => sdk.vault.getUserStats(input as Input)

    expect(getUserStats).toThrow(message)
    expect(graphql.calls).toHaveLength(0)
  })
})
