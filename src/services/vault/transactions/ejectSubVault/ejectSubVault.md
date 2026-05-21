---
id: ejectSubVault
slug: /sdk/api/vault/transactions/ejectsubvault
description: Use the StakeWise SDK ejectSubVault method to remove an active sub-vault from a StakeWise V3 meta vault registry. Called by the meta vault curator to drop an in-use sub-vault from the registry.
---

#### Description:

Ejecting a sub-vault from the vault registry.

#### Arguments:

| Name           | Type     | Required | Description               |
|----------------|----------|----------|---------------------------|
| subVaultAddress | `string` | **Yes**  | The sub-vault address to eject  |
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
const hash = await sdk.vault.ejectSubVault(params)

// Wait for the transaction to be confirmed and indexed
await sdk.provider.waitForTransaction(hash)
await sdk.utils.waitForSubgraph({ hash })

// When you sign transactions on the backend (for custodians)
const { data, to } = await sdk.vault.ejectSubVault.encode(params)
// Get an approximate gas per transaction
const gas = await sdk.vault.ejectSubVault.estimateGas(params)
```
