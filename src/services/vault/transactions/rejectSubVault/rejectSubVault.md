---
id: rejectSubVault
slug: /sdk/api/vault/transactions/rejectsubvault
description: Use the StakeWise SDK rejectSubVault method to reject a proposed sub-vault from a StakeWise V3 meta vault registry before it becomes active. Called by the meta vault curator to discard a pending sub-vault proposal.
---

#### Description:

Rejecting a sub-vault from the vault registry.

#### Arguments:

| Name           | Type     | Required | Description               |
|----------------|----------|----------|---------------------------|
| subVaultAddress | `string` | **Yes**  | The sub-vault address to reject  |
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
const hash = await sdk.vault.rejectSubVault(params)

// Wait for the transaction to be confirmed and indexed
await sdk.provider.waitForTransaction(hash)
await sdk.utils.waitForSubgraph({ hash })

// When you sign transactions on the backend (for custodians)
const { data, to } = await sdk.vault.rejectSubVault.encode(params)
// Get an approximate gas per transaction
const gas = await sdk.vault.rejectSubVault.estimateGas(params)
```
