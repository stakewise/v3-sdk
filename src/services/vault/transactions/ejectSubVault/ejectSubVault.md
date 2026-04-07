---
id: ejectSubVault
slug: /sdk/api/vault/transactions/ejectsubvault
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
// When you sign transactions on the backend (for custodians)
const { data, to } = await sdk.vault.ejectSubVault.encode(params)
// Get an approximate gas per transaction
const gas = await sdk.vault.ejectSubVault.estimateGas(params)
```
