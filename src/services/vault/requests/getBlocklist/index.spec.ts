import { describe, expect } from 'vitest'

import { it, subgraphUrl, vaultAddress } from '../../../../../test'
import { vaultInvalidCase } from '../../../../../test/mocks/invalidCases'

import type { GetBlocklistInput } from './index'
import type { BlocklistAccountsQueryPayload } from '../../../../graphql/subgraph/vault'


type Input = StakeWise.ExtractInput<GetBlocklistInput>

const blocklistPayload: BlocklistAccountsQueryPayload = {
  vaultBlockedAccounts: [
    { createdAt: '1743785736', address: '0xf7b31119c2682c88d88d455dbb9d5932c65cf1be' },
    { createdAt: '1743785700', address: '0xf3701f445b6bdafedbca97d1e477357839e4120d' },
    { createdAt: '1743785640', address: '0xefe301d259f525ca1ba74a7977b80d5b060b3cca' },
  ],
}

const emptyPayload: BlocklistAccountsQueryPayload = { vaultBlockedAccounts: [] }

const resultCases = [
  {
    name: 'returns blocklist',
    data: blocklistPayload,
    expected: [
      { createdAt: 1743785736000, address: '0xF7B31119c2682c88d88D455dBb9d5932c65Cf1bE' },
      { createdAt: 1743785700000, address: '0xf3701F445b6BDaFeDbcA97D1e477357839e4120D' },
      { createdAt: 1743785640000, address: '0xEFE301d259F525cA1ba74A7977b80D5b060B3ccA' },
    ],
  },
  {
    name: 'empty blocklist',
    data: emptyPayload,
    expected: [],
  },
]

describe('getBlocklist', () => {
  it.for(resultCases)('$name', async ({ data, expected }, { sdk, graphql }) => {
    graphql.mock<BlocklistAccountsQueryPayload>({ name: 'BlocklistAccounts', data })

    const result = await sdk.vault.getBlocklist({ vaultAddress })

    expect(result).toEqual({ blocklist: expected })
  })

  it('paging', async ({ sdk, graphql }) => {
    graphql.mock<BlocklistAccountsQueryPayload>({ name: 'BlocklistAccounts', data: emptyPayload })

    await sdk.vault.getBlocklist({ vaultAddress, skip: 20, limit: 10, orderDirection: 'asc' })

    const call = {
      url: subgraphUrl,
      operationName: 'BlocklistAccounts',
      variables: {
        skip: 20,
        limit: 10,
        where: { vault: vaultAddress },
        orderDirection: 'asc',
      },
    }

    expect(graphql.calls).toEqual([ expect.objectContaining(call) ])
  })

  it('invalid vault address', async ({ sdk, graphql }) => {
    const { input, message } = vaultInvalidCase

    const getBlocklist = () => sdk.vault.getBlocklist(input as Input)

    expect(getBlocklist).toThrow(message)
    expect(graphql.calls).toHaveLength(0)
  })
})
