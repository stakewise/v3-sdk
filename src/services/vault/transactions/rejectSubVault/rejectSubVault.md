---
id: rejectSubVault
slug: /vault/transactions/rejectsubvault
---

#### Description:

Rejecting a sub-vault from the vault registry.

#### Arguments:

| Name           | Type     | Required | Description               |
|----------------|----------|----------|---------------------------|
| subVaultAddress | `string` | **Yes**  | The sub-vault address to reject  |
| userAddress    | `string` | **Yes**  | The user address          |
| vaultAddress   | `string` | **Yes**  | The address of the vault  |
| subVaultsRegistryAddress   | `string` | **Yes**  | The sub-vault registry address  |

#### Example:

```ts
const params = {
  subVaultsRegistryAddress: '0x...',
  subVaultAddress: '0x...',
  vaultAddress: '0x...',
  userAddress: '0x...',
}

// Send transaction
const hash = await sdk.vault.rejectSubVault(params)
// When you sign transactions on the backend (for custodians)
const { data, to } = await sdk.vault.rejectSubVault.encode(params)
// Get an approximate gas per transaction
const gas = await sdk.vault.rejectSubVault.estimateGas(params)
```
