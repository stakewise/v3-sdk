import { describe, expect } from 'vitest'

import {
  it,
  subgraphUrl,
  checksumAddress,
  mixedCaseVaultAddress,
  lowercaseChecksumAddress,
  lowercaseMixedCaseVaultAddress,
} from '../../../../../test'
import { baseInputWiringCase } from '../../../../../test/mocks/invalidCases'
import { allocatorsPayload, emptyAllocatorsPayload } from '../../../../../test/mocks/allocators'

import type { GetStakeBalanceInput } from './index'
import type { AllocatorsQueryPayload } from '../../../../graphql/subgraph/allocator'


type Input = StakeWise.ExtractInput<GetStakeBalanceInput>

const resultCases = [
  {
    name: 'returns balance',
    data: allocatorsPayload,
    expected: {
      assets: 3711145378128715532n,
      totalEarnedAssets: 55037136560082430n,
      totalStakeEarnedAssets: 10864133128366538n,
      totalBoostEarnedAssets: 44173003431715892n,
    },
  },
  {
    name: 'new user',
    data: emptyAllocatorsPayload,
    expected: {
      assets: 0n,
      totalEarnedAssets: 0n,
      totalStakeEarnedAssets: 0n,
      totalBoostEarnedAssets: 0n,
    },
  },
]

describe('getStakeBalance', () => {
  it.for(resultCases)('$name', async ({ data, expected }, { sdk, graphql }) => {
    graphql.mock<AllocatorsQueryPayload>({ name: 'Allocators', data })

    const input = { vaultAddress: mixedCaseVaultAddress, userAddress: checksumAddress }
    const variables = {
      address: lowercaseChecksumAddress,
      vaultAddress: lowercaseMixedCaseVaultAddress,
    }

    const result = await sdk.vault.getStakeBalance(input)

    expect(result).toEqual(expected)
    expect(graphql.calls).toEqual([
      expect.objectContaining({ url: subgraphUrl, operationName: 'Allocators', variables }),
    ])
  })

  it('invalid vault address', async ({ sdk, graphql }) => {
    const { input, message } = baseInputWiringCase

    const getStakeBalance = () => sdk.vault.getStakeBalance(input as Input)

    expect(getStakeBalance).toThrow(message)
    expect(graphql.calls).toHaveLength(0)
  })
})
