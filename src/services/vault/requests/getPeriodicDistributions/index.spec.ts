import { describe, expect } from 'vitest'

import { it, subgraphUrl, vaultAddress, checksumAddress, lowercaseChecksumAddress } from '../../../../../test'

import type { GetPeriodicDistributionsInput } from './index'
import type { PeriodicDistributionsQueryPayload } from '../../../../graphql/subgraph/vault'


type Input = StakeWise.ExtractInput<GetPeriodicDistributionsInput>

const startTimestamp = 1770400000
const endTimestamp = 1763730000

const periodicDistributionsPayload: PeriodicDistributionsQueryPayload = {
  periodicDistributions: [
    {
      apy: '1.118106527347736751838961367490059',
      token: '0x0b010000b7624eb9b3dfbc279673c76e9d29d5f7',
      endTimestamp: '1767262751',
    },
    {
      apy: '2.388604330929266256351851650824491',
      token: '0x0b010000b7624eb9b3dfbc279673c76e9d29d5f7',
      endTimestamp: '1763735783',
    },
  ],
}

const resultCases = [
  {
    name: 'returns distributions',
    data: periodicDistributionsPayload,
    expected: [
      {
        apy: '1.118106527347736751838961367490059',
        token: '0x0b010000b7624eb9b3dfbc279673c76e9d29d5f7',
        endTimestamp: '1767262751',
      },
      {
        apy: '2.388604330929266256351851650824491',
        token: '0x0b010000b7624eb9b3dfbc279673c76e9d29d5f7',
        endTimestamp: '1763735783',
      },
    ],
  },
  {
    name: 'no distributions',
    data: { periodicDistributions: [] },
    expected: [],
  },
]

const invalidCases = [
  {
    name: 'invalid vault address',
    input: { vaultAddress: '0x123', startTimestamp, endTimestamp },
    message: 'The "vaultAddress" argument must be a valid address',
  },
  {
    name: 'invalid start',
    input: { vaultAddress, startTimestamp: '1770400000', endTimestamp },
    message: 'The "startTimestamp" argument must be a number',
  },
  {
    name: 'invalid end',
    input: { vaultAddress, startTimestamp, endTimestamp: '1763730000' },
    message: 'The "endTimestamp" argument must be a number',
  },
  {
    name: 'missing start',
    input: { vaultAddress, endTimestamp },
    message: 'The "startTimestamp" argument',
  },
  {
    name: 'missing end',
    input: { vaultAddress, startTimestamp },
    message: 'The "endTimestamp" argument',
  },
]

describe('getPeriodicDistributions', () => {
  it.for(resultCases)('$name', async ({ data, expected }, { sdk, graphql }) => {
    graphql.mock<PeriodicDistributionsQueryPayload>({ name: 'PeriodicDistributions', data })

    const input = { vaultAddress: checksumAddress, startTimestamp, endTimestamp }
    const variables = {
      endTimestamp: '1763730000',
      startTimestamp: '1770400000',
      vaultAddress: lowercaseChecksumAddress,
    }

    const result = await sdk.vault.getPeriodicDistributions(input)

    expect(result).toEqual(expected)
    expect(graphql.calls).toEqual([
      expect.objectContaining({ url: subgraphUrl, operationName: 'PeriodicDistributions', variables }),
    ])
  })

  it.for(invalidCases)('$name', async ({ input, message }, { sdk, graphql }) => {
    const getDistributions = () => sdk.vault.getPeriodicDistributions(input as Input)

    expect(getDistributions).toThrow(message)
    expect(graphql.calls).toHaveLength(0)
  })
})
