import { describe, expect } from 'vitest'

import { it } from '../../../../test'

import applySubgraphErrorPolicy from './applySubgraphErrorPolicy'


const cases = [
  {
    name: 'field with arguments',
    query: 'query Vault($id: ID!) { vault(id: $id) { id } }',
    expected: 'query Vault($id: ID!) { vault(subgraphError: allow, id: $id) { id } }',
  },
  {
    name: 'field without arguments',
    query: 'query Aave { aaves { id } }',
    expected: 'query Aave { aaves(subgraphError: allow) { id } }',
  },
  {
    name: 'several root fields',
    query: 'query Data( $vaultAddress: String!) { aave(id: 1) { id } vaults( where: { addressString: $vaultAddress } ) { osTokenConfig { ltvPercent } }}',
    expected: 'query Data( $vaultAddress: String!) { aave(subgraphError: allow, id: 1) { id } vaults(subgraphError: allow,  where: { addressString: $vaultAddress } ) { osTokenConfig { ltvPercent } }}',
  },
  {
    name: 'alias',
    query: 'query Data { first: vaults(first: 1) { id } }',
    expected: 'query Data { first: vaults(subgraphError: allow, first: 1) { id } }',
  },
  {
    name: 'skips _meta and __typename',
    query: 'query Data { _meta { hasIndexingErrors } __typename vaults { id } }',
    expected: 'query Data { _meta { hasIndexingErrors } __typename vaults(subgraphError: allow) { id } }',
  },
  {
    name: 'skips fragment spreads and nested fields',
    query: 'query Data { vaults { ...VaultFragment allocators { id } } } fragment VaultFragment on Vault { id }',
    expected: 'query Data { vaults(subgraphError: allow) { ...VaultFragment allocators { id } } } fragment VaultFragment on Vault { id }',
  },
  {
    name: 'skips braces inside strings and variable defaults',
    query: 'query Data($where: Vault_filter = {}) { vaults(where: $where, orderBy: "{") { id } }',
    expected: 'query Data($where: Vault_filter = {}) { vaults(subgraphError: allow, where: $where, orderBy: "{") { id } }',
  },
  {
    name: 'skips comments',
    query: 'query Data {\n  # it\'s { not a field\n  vaults { id }\n}',
    expected: 'query Data {\n  # it\'s { not a field\n  vaults(subgraphError: allow) { id }\n}',
  },
  {
    name: 'skips fragments defined before the operation',
    query: 'fragment VaultFragment on Vault { id } query Data { vaults { ...VaultFragment } }',
    expected: 'fragment VaultFragment on Vault { id } query Data { vaults(subgraphError: allow) { ...VaultFragment } }',
  },
]

describe('applySubgraphErrorPolicy', () => {

  it.for(cases)('$name', ({ query, expected }) => {
    expect(applySubgraphErrorPolicy(query, 'allow')).toEqual(expected)
  })

  it('keeps the query for deny policy', () => {
    const query = 'query Aave { aaves { id } }'

    expect(applySubgraphErrorPolicy(query, 'deny')).toEqual(query)
    expect(applySubgraphErrorPolicy(query)).toEqual(query)
  })

  it('keeps the query with subgraphError argument', () => {
    const query = 'query Aave { aaves(subgraphError: deny) { id } }'

    expect(applySubgraphErrorPolicy(query, 'allow')).toEqual(query)
  })
})
