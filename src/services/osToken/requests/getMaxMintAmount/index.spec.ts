import { describe, expect } from 'vitest'
import { parseEther } from 'ethers'

import {
  stakeAmount,
  userAddress,
  subgraphUrl,
  it as baseIt,
  vaultAddress,
  rewardPerSecond,
  checksumAddress,
  lowercaseChecksumAddress,
} from '../../../../../test'
import { baseInputWiringCase } from '../../../../../test/mocks/invalidCases'
import { allocatorsPayload, emptyAllocatorsPayload } from '../../../../../test/mocks/allocators'

import type { GetMaxMintAmountInput } from './index'
import type { OsTokenPositionInput } from '../../../../../test'
import type { AllocatorsQueryPayload } from '../../../../graphql/subgraph/allocator'


type Input = StakeWise.ExtractInput<GetMaxMintAmountInput>

type MaxMintInput = OsTokenPositionInput & {
  stakeAssets?: bigint | null
}

const [ allocator ] = allocatorsPayload.allocators

const it = baseIt.extend('mockMaxMint', ({ graphql, mockOsTokenPosition }) => (
  (values: MaxMintInput = {}) => {
    const { stakeAssets = stakeAmount, ...position } = values
    const data: AllocatorsQueryPayload = stakeAssets === null
      ? emptyAllocatorsPayload
      : { allocators: [ { ...allocator, assets: String(stakeAssets) } ] }

    mockOsTokenPosition(position)
    graphql.mock<AllocatorsQueryPayload>({ name: 'Allocators', data })
  }
))

const resultCases = [
  {
    name: 'hourly reserve',
    values: { avgRewardPerSecond: rewardPerSecond },
    expected: 2571397714285714284n,
  },
  {
    name: 'zero debt',
    values: { osTokenShares: 0n, avgRewardPerSecond: rewardPerSecond },
    expected: 8571397714285714284n,
  },
  {
    name: 'dust left',
    values: { osTokenShares: 8571428571428571428n },
    expected: 0n,
  },
  {
    name: 'above ceiling',
    values: { osTokenShares: parseEther('9') },
    expected: 0n,
  },
  {
    name: 'new user',
    values: { stakeAssets: null },
    expected: 0n,
  },
  {
    name: 'extra stake',
    values: {},
    additionalStakedAssets: parseEther('5'),
    expected: 6857142857142857141n,
  },
  {
    name: 'extra stake only',
    values: { stakeAssets: null },
    additionalStakedAssets: stakeAmount,
    expected: 2571428571428571427n,
  },
]

const invalidCases = [
  baseInputWiringCase,
  {
    name: 'invalid additional stake',
    input: { userAddress, vaultAddress, additionalStakedAssets: '1' },
    message: 'The "additionalStakedAssets" argument must be of type bigint',
  },
]

describe('getMaxMintAmount', () => {
  it.for(resultCases)('$name', async (resultCase, { sdk, graphql, mockMaxMint }) => {
    const { values, expected, additionalStakedAssets } = resultCase

    mockMaxMint(values)

    const input = { vaultAddress, userAddress: checksumAddress, additionalStakedAssets }

    const amount = await sdk.osToken.getMaxMintAmount(input)

    expect(amount).toBe(expected)
    expect(graphql.calls).toEqual([
      expect.objectContaining({
        url: subgraphUrl,
        operationName: 'VaultOsTokenConfig',
        variables: { address: vaultAddress },
      }),
      expect.objectContaining({
        url: subgraphUrl,
        operationName: 'Allocators',
        variables: { vaultAddress, address: lowercaseChecksumAddress },
      }),
    ])
  })

  it.for(invalidCases)('$name', async ({ input, message }, { sdk, runner, graphql }) => {
    const request = sdk.osToken.getMaxMintAmount(input as Input)

    await expect(request).rejects.toThrow(message)
    expect(graphql.calls).toHaveLength(0)
    expect(runner.calls).toHaveLength(0)
  })
})
