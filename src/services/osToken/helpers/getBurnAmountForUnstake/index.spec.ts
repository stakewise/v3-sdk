import { describe, expect } from 'vitest'
import { parseEther } from 'ethers'

import {
  stakeAmount,
  userAddress,
  it as baseIt,
  vaultAddress,
  mintedShares,
  rewardPerSecond,
} from '../../../../../test'
import type { OsTokenPositionInput } from '../../../../../test'

import type { GetBurnAmountForUnstakeInput } from './index'
import type { AllocatorsQueryPayload } from '../../../../graphql/subgraph/allocator'


type Input = StakeWise.ExtractInput<GetBurnAmountForUnstakeInput>

const allocatorsPayload: AllocatorsQueryPayload = {
  allocators: [
    {
      apy: '0',
      assets: stakeAmount.toString(),
      totalEarnedAssets: '0',
      totalStakeEarnedAssets: '0',
      totalBoostEarnedAssets: '0',
    },
  ],
}

const it = baseIt.extend('mockBurnAmountForUnstake', ({ graphql, mockOsTokenPosition }) => (
  (values: OsTokenPositionInput) => {
    mockOsTokenPosition(values)

    graphql.mock<AllocatorsQueryPayload>({ name: 'Allocators', data: allocatorsPayload })
  }
))

const cases = [
  {
    name: 'hourly reserve',
    values: { avgRewardPerSecond: rewardPerSecond },
    assets: parseEther('4'),
    expected: 857161371361920240n,
  },
  {
    name: 'full exit',
    values: {},
    assets: undefined,
    expected: mintedShares,
  },
  {
    name: 'whole stake',
    values: {},
    assets: stakeAmount,
    expected: mintedShares,
  },
  {
    name: 'above stake',
    values: {},
    assets: stakeAmount + parseEther('1'),
    expected: mintedShares,
  },
  {
    name: 'one wei left',
    values: {},
    assets: stakeAmount - 1n,
    expected: mintedShares,
  },
  {
    name: 'dust burn',
    values: {},
    assets: 3_000_000_000_000_000_001n,
    expected: 0n,
  },
  {
    name: 'zero assets',
    values: {},
    assets: 0n,
    expected: 0n,
  },
  {
    name: 'no minted shares',
    values: { osTokenShares: 0n },
    assets: undefined,
    expected: 0n,
  },
  {
    name: 'zero ltv',
    values: { ltvPercent: 0n },
    assets: undefined,
    expected: 0n,
  },
]

const invalidCases = [
  {
    name: 'invalid user address',
    values: { userAddress: '0x123', vaultAddress },
    expected: 'The "userAddress" argument must be a valid address',
  },
  {
    name: 'invalid assets',
    values: { userAddress, vaultAddress, assets: 1 } as unknown as Input,
    expected: 'The "assets" argument must be of type bigint',
  },
]

describe('getBurnAmountForUnstake', () => {
  it.for(cases)('$name', async ({ values, assets, expected }, { sdk, mockBurnAmountForUnstake }) => {
    mockBurnAmountForUnstake(values)

    const shares = await sdk.osToken.getBurnAmountForUnstake({ userAddress, vaultAddress, assets })

    expect(shares).toBe(expected)
  })

  it.for(invalidCases)('$name', async ({ values, expected }, { sdk }) => {
    const request = sdk.osToken.getBurnAmountForUnstake(values)

    await expect(request).rejects.toThrow(expected)
  })
})
