import { describe, expect } from 'vitest'

import { VaultType } from '../../../../helpers'

import { it } from '../../../../../test'


type FactoryName = keyof StakeWise.Contracts['factories']

const factoryCases = [
  {
    name: 'default',
    input: {},
    factory: 'vault',
  },
  {
    name: 'private',
    input: { vaultType: VaultType.Private },
    factory: 'privateVault',
  },
  {
    name: 'blocklist',
    input: { vaultType: VaultType.Blocklist },
    factory: 'blocklistVault',
  },
  {
    name: 'meta vault',
    input: { vaultType: VaultType.MetaVault },
    factory: 'metavault',
  },
  {
    name: 'private meta vault',
    input: { vaultType: VaultType.PrivateMetaVault },
    factory: 'privateMetavault',
  },
  {
    name: 'erc20 default',
    input: { vaultType: VaultType.Default, isErc20: true },
    factory: 'erc20Vault',
  },
  {
    name: 'erc20 private',
    input: { vaultType: VaultType.Private, isErc20: true },
    factory: 'erc20PrivateVault',
  },
  {
    name: 'erc20 blocklist',
    input: { vaultType: VaultType.Blocklist, isErc20: true },
    factory: 'erc20BlocklistVault',
  },
  {
    name: 'erc20 meta vault',
    input: { vaultType: VaultType.MetaVault, isErc20: true },
    factory: 'erc20Metavault',
  },
  {
    name: 'erc20 private meta',
    input: { vaultType: VaultType.PrivateMetaVault, isErc20: true },
    factory: 'erc20PrivateMetavault',
  },
]

describe('getVaultFactory', () => {
  it.for(factoryCases)('$name', ({ input, factory }, { sdk }) => {
    const expected = sdk.contracts.factories[factory as FactoryName]

    const result = sdk.vault.getVaultFactory(input)

    expect(result).toBe(expected)
  })
})
