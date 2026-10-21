import { describe, expect } from 'vitest'

import {
  it,
  userAddress,
  vaultAddress,
  spenderAddress,
  mixedCaseVaultAddress,
  lowercaseMixedCaseVaultAddress,
} from '../../../test'
import { vaultInvalidCase } from '../../../test/mocks/invalidCases'

import type { VariablesCase } from '../../../test'
import type { GetListVariablesInput } from './getListVariables'


type Input = StakeWise.ExtractInput<GetListVariablesInput>

const baseInput = { vaultAddress: mixedCaseVaultAddress }
const vault = lowercaseMixedCaseVaultAddress

const variablesCases: VariablesCase<Input>[] = [
  {
    name: 'paging',
    input: { skip: 20, limit: 5 },
    expected: {
      where: { vault },
      skip: 20,
      limit: 5,
      orderDirection: 'desc',
    },
  },
  {
    name: 'ascending',
    input: { orderDirection: 'asc' },
    expected: {
      where: { vault },
      skip: 0,
      limit: 100,
      orderDirection: 'asc',
    },
  },
  {
    name: 'descending',
    input: { orderDirection: 'desc' },
    expected: {
      where: { vault },
      skip: 0,
      limit: 100,
      orderDirection: 'desc',
    },
  },
  {
    name: 'search',
    input: { search: 'AbC' },
    expected: {
      where: { vault, address_contains: 'abc' },
      skip: 0,
      limit: 100,
      orderDirection: 'desc',
    },
  },
  {
    name: 'empty search',
    input: { search: '' },
    expected: {
      where: { vault },
      skip: 0,
      limit: 100,
      orderDirection: 'desc',
    },
  },
  {
    name: 'address list',
    input: { addressIn: [ userAddress, spenderAddress ] },
    expected: {
      where: { vault, address_in: [ userAddress, spenderAddress ] },
      skip: 0,
      limit: 100,
      orderDirection: 'desc',
    },
  },
  {
    name: 'search and list',
    input: { search: 'AbC', addressIn: [ spenderAddress ] },
    expected: {
      where: { vault, address_in: [ spenderAddress ], address_contains: 'abc' },
      skip: 0,
      limit: 100,
      orderDirection: 'desc',
    },
  },
]

const invalidCases = [
  vaultInvalidCase,
  {
    name: 'invalid skip',
    input: { vaultAddress, skip: '1' },
    message: 'The "skip" argument must be a number',
  },
  {
    name: 'invalid limit',
    input: { vaultAddress, limit: '1' },
    message: 'The "limit" argument must be a number',
  },
  {
    name: 'invalid search',
    input: { vaultAddress, search: 1 },
    message: 'The "search" argument must be a string',
  },
  {
    name: 'invalid direction',
    input: { vaultAddress, orderDirection: 'sideways' },
    message: 'The "orderDirection" argument must be "asc" or "desc"',
  },
  {
    name: 'list not array',
    input: { vaultAddress, addressIn: userAddress },
    message: 'The "addressIn" argument must be an array',
  },
  {
    name: 'empty list',
    input: { vaultAddress, addressIn: [] },
    message: 'The "addressIn" argument is an empty array',
  },
  {
    name: 'invalid list address',
    input: { vaultAddress, addressIn: [ userAddress, '0x123' ] },
    message: 'The "addressIn" argument must be an array of valid addresses',
  },
]

describe('getListVariables', () => {
  it.for(variablesCases)('$name', ({ input, expected }, { sdk }) => {
    const result = sdk.utils.getListVariables({ ...baseInput, ...input })

    expect(result).toEqual(expected)
  })

  it.for(invalidCases)('$name', ({ input, message }, { sdk }) => {
    const getListVariables = () => sdk.utils.getListVariables(input as Input)

    expect(getListVariables).toThrow(message)
  })
})
