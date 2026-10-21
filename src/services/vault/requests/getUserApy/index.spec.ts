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

import type { GetUserApyInput } from './index'
import type { UserApyQueryPayload } from '../../../../graphql/subgraph/vault'


type Input = StakeWise.ExtractInput<GetUserApyInput>

const resultCases = [
  {
    name: 'returns apy',
    allocators: [ { apy: '9.274438391379320684775231579576368' } ],
    expected: 9.27443839137932,
  },
  {
    name: 'new user',
    allocators: [],
    expected: 0,
  },
]

describe('getUserApy', () => {
  it.for(resultCases)('$name', async ({ expected, allocators }, { sdk, graphql }) => {
    graphql.mock<UserApyQueryPayload>({ name: 'UserApy', data: { allocators } })

    const input = { vaultAddress: mixedCaseVaultAddress, userAddress: checksumAddress }
    const variables = {
      userAddress: lowercaseChecksumAddress,
      vaultAddress: lowercaseMixedCaseVaultAddress,
    }

    const result = await sdk.vault.getUserApy(input)

    expect(result).toBe(expected)
    expect(graphql.calls).toEqual([
      expect.objectContaining({ url: subgraphUrl, operationName: 'UserApy', variables }),
    ])
  })

  it('invalid vault address', async ({ sdk, graphql }) => {
    const { input, message } = baseInputWiringCase

    const getUserApy = () => sdk.vault.getUserApy(input as Input)

    expect(getUserApy).toThrow(message)
    expect(graphql.calls).toHaveLength(0)
  })
})
