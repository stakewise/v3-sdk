import { describe, expect } from 'vitest'

import {
  it,
  subgraphUrl,
  mixedCaseBaseInput,
  lowercaseChecksumAddress,
  lowercaseMixedCaseVaultAddress,
} from '../../../../../test'
import { baseInputWiringCase } from '../../../../../test/mocks/invalidCases'

import type { GetClaimAmountInput } from './index'
import type { RewardSplitterShareHoldersQueryPayload } from '../../../../graphql/subgraph/rewardSplitters'


type Input = StakeWise.ExtractInput<GetClaimAmountInput>

const rewardSplitterAddress = '0x02edcA6Dc56997de06B5707cf9De70b4f13f6CB7'
const lowercaseRewardSplitterAddress = '0x02edca6dc56997de06b5707cf9de70b4f13f6cb7'
const firstOtherAddress = '0x1832de15f6ac17c457867206555e5a50de1df63f'
const secondOtherAddress = '0x6b8c2ebf69ae6c7ae583f219d464637bd1b6bfa3'

const resultCases = [
  {
    name: 'with other splitters',
    data: {
      selected: [ { earnedVaultAssets: '7082015058230860' } ],
      other: [
        { earnedVaultAssets: '225715451964659', rewardSplitter: { id: firstOtherAddress } },
        { earnedVaultAssets: '7082015058230860', rewardSplitter: { id: lowercaseRewardSplitterAddress } },
        { earnedVaultAssets: '677146355893979', rewardSplitter: { id: secondOtherAddress } },
      ],
    },
    expected: {
      active: { assets: 7082015058230860n, address: rewardSplitterAddress },
      inactive: [
        { assets: 225715451964659n, address: firstOtherAddress },
        { assets: 677146355893979n, address: secondOtherAddress },
      ],
    },
  },
  {
    name: 'no shares',
    data: { selected: [], other: [] },
    expected: {
      active: { assets: 0n, address: rewardSplitterAddress },
      inactive: [],
    },
  },
]

const invalidCases = [
  baseInputWiringCase,
  {
    name: 'invalid splitter address',
    input: { ...mixedCaseBaseInput, rewardSplitterAddress: '0x123' },
    message: 'The "rewardSplitterAddress" argument must be a valid address',
  },
  {
    name: 'missing splitter address',
    input: mixedCaseBaseInput,
    message: 'The "rewardSplitterAddress" argument',
  },
]

describe('getClaimAmount', () => {
  it.for(resultCases)('$name', async ({ data, expected }, { sdk, graphql }) => {
    graphql.mock<RewardSplitterShareHoldersQueryPayload>({ name: 'RewardSplitterShareHolders', data })

    const input = { ...mixedCaseBaseInput, rewardSplitterAddress }
    const variables = {
      address: lowercaseChecksumAddress,
      vaultAddress: lowercaseMixedCaseVaultAddress,
      rewardSplitterAddress: lowercaseRewardSplitterAddress,
    }

    const result = await sdk.rewardSplitter.getClaimAmount(input)

    expect(result).toEqual(expected)
    expect(graphql.calls).toEqual([
      expect.objectContaining({ url: subgraphUrl, operationName: 'RewardSplitterShareHolders', variables }),
    ])
  })

  it.for(invalidCases)('$name', async ({ input, message }, { sdk, graphql }) => {
    const getClaimAmount = () => sdk.rewardSplitter.getClaimAmount(input as Input)

    expect(getClaimAmount).toThrow(message)
    expect(graphql.calls).toHaveLength(0)
  })
})
