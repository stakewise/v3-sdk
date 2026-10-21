import { describe, expect } from 'vitest'

import {
  it,
  userAddress,
  subgraphUrl,
  mixedCaseVaultAddress,
  lowercaseMixedCaseVaultAddress,
} from '../../../../../test'
import { vaultInvalidCase } from '../../../../../test/mocks/invalidCases'

import type { GetWhitelistInput } from './index'
import type { WhitelistAccountsQueryPayload } from '../../../../graphql/subgraph/vault'


type Input = StakeWise.ExtractInput<GetWhitelistInput>

const whitelistPayload: WhitelistAccountsQueryPayload = {
  privateVaultAccounts: [
    { createdAt: '1777034484', address: '0x7dd5adc8affc2c0e14c64a0d84cce35877aa45b0' },
    { createdAt: '1777034280', address: '0xef741249bcb02ac611bc2b8db9fe0902331a6288' },
    { createdAt: '1776886200', address: '0x78ef104ef2251c33831c464ef559d2b9425011b3' },
  ],
}

const resultCases = [
  {
    name: 'returns whitelist',
    input: {
      skip: 20,
      limit: 10,
      search: 'F7B3',
      orderDirection: 'asc' as const,
      addressIn: [ userAddress ],
      vaultAddress: mixedCaseVaultAddress,
    },
    data: whitelistPayload,
    variables: {
      skip: 20,
      limit: 10,
      orderDirection: 'asc',
      where: {
        address_in: [ userAddress ],
        address_contains: 'f7b3',
        vault: lowercaseMixedCaseVaultAddress,
      },
    },
    expected: {
      whitelist: [
        { createdAt: 1777034484000, address: '0x7dD5Adc8AfFc2C0E14c64A0D84cce35877aA45b0' },
        { createdAt: 1777034280000, address: '0xEf741249Bcb02aC611bc2B8dB9Fe0902331a6288' },
        { createdAt: 1776886200000, address: '0x78EF104eF2251C33831c464ef559D2b9425011B3' },
      ],
    },
  },
  {
    name: 'empty whitelist',
    input: { vaultAddress: mixedCaseVaultAddress, addressIn: [ userAddress ] },
    data: { privateVaultAccounts: [] },
    variables: {
      skip: 0,
      limit: 100,
      orderDirection: 'desc',
      where: { vault: lowercaseMixedCaseVaultAddress, address_in: [ userAddress ] },
    },
    expected: { whitelist: [] },
  },
]

describe('getWhitelist', () => {
  it.for(resultCases)('$name', async (resultCase, { sdk, graphql }) => {
    const {
      data,
      input,
      expected,
      variables,
    } = resultCase

    graphql.mock<WhitelistAccountsQueryPayload>({ name: 'WhitelistAccounts', data })

    const result = await sdk.vault.getWhitelist(input)

    expect(result).toEqual(expected)
    expect(graphql.calls).toEqual([
      expect.objectContaining({ url: subgraphUrl, operationName: 'WhitelistAccounts', variables }),
    ])
  })

  it('invalid vault address', async ({ sdk, graphql }) => {
    const { input, message } = vaultInvalidCase

    const getWhitelist = () => sdk.vault.getWhitelist(input as Input)

    expect(getWhitelist).toThrow(message)
    expect(graphql.calls).toHaveLength(0)
  })
})
