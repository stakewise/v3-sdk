---
id: addSubVault
slug: /sdk/api/vault/transactions/addsubvault
description: Use the StakeWise SDK addSubVault method to add a sub-vault to a StakeWise V3 meta vault registry on Mainnet, Hoodi, or Gnosis. Called by the meta vault curator to extend the registry of underlying vaults receiving routed deposits.
---

#### Description:

Adds a new sub-vault to a meta vault's registry. Called by the meta vault admin (curator).

#### Prerequisites before calling addSubVault

The contract reverts if the sub-vault is unreachable for the meta vault. Pre-check on the frontend so the user gets an informative error instead of a generic revert:

- If the sub-vault is **private** (`isPrivate: true` from `sdk.vault.getVault`), the meta vault address must be in the sub-vault's whitelist. Read the whitelist with `sdk.vault.getWhitelist({ vaultAddress: subVaultAddress })` and skip or warn the user if the meta vault is not present.
- If the sub-vault has a **blocklist** (`isBlocklist: true`), the meta vault address must not be on the blocklist. Read it with `sdk.vault.getBlocklist({ vaultAddress: subVaultAddress })`.
- The sub-vault itself must not be a meta vault (`isMetaVault: false`). Nesting meta vaults is not supported.
- The sub-vault should not already be in the meta vault's registry. Check the current list with `sdk.vault.getSubVaults({ vaultAddress })`.

```ts
const subVault = await sdk.vault.getVault({ vaultAddress: subVaultAddress })

if (subVault.isMetaVault) {
  throw new Error('Cannot add a meta vault as a sub-vault')
}

if (subVault.isPrivate) {
  const whitelist = await sdk.vault.getWhitelist({ vaultAddress: subVaultAddress, limit: 1000, skip: 0 })
  const isWhitelisted = whitelist.some(({ address }) => address.toLowerCase() === metaVaultAddress.toLowerCase())

  if (!isWhitelisted) {
    throw new Error('Meta vault must be on the sub-vault whitelist before it can be added')
  }
}

if (subVault.isBlocklist) {
  const blocklist = await sdk.vault.getBlocklist({ vaultAddress: subVaultAddress, limit: 1000, skip: 0 })
  const isBlocked = blocklist.some(({ address }) => address.toLowerCase() === metaVaultAddress.toLowerCase())

  if (isBlocked) {
    throw new Error('Meta vault is on the sub-vault blocklist and cannot be added')
  }
}
```

#### Arguments:

| Name           | Type     | Required | Description               |
|----------------|----------|----------|---------------------------|
| subVaultAddress | `string` | **Yes**  | New sub-vault address  |
| userAddress    | `string` | **Yes**  | The user address          |
| vaultAddress   | `string` | **Yes**  | The address of the vault  |

#### Example:

```ts
const params = {
  subVaultAddress: '0x...',
  vaultAddress: '0x...',
  userAddress: '0x...',
}

// Send transaction
const hash = await sdk.vault.addSubVault(params)

// Wait for the transaction to be confirmed and indexed
await sdk.provider.waitForTransaction(hash)
await sdk.utils.waitForSubgraph({ hash })

// When you sign transactions on the backend (for custodians)
const { data, to } = await sdk.vault.addSubVault.encode(params)
// Get an approximate gas per transaction
const gas = await sdk.vault.addSubVault.estimateGas(params)
```
