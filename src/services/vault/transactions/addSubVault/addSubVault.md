---
id: addSubVault
slug: /vault/transactions/addsubvault
---

#### Description:

Adding a new sub-vault to the vault registry.

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
// When you sign transactions on the backend (for custodians)
const { data, to } = await sdk.vault.addSubVault.encode(params)
// Get an approximate gas per transaction
const gas = await sdk.vault.addSubVault.estimateGas(params)
```
