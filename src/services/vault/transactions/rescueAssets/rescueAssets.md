---
id: rescueAssets
slug: /sdk/api/vault/transactions/rescueassets
description: Use the StakeWise SDK rescueAssets method to recover assets stuck on a StakeWise V3 vault. Callable only by the vault admin. The vault state is updated automatically before the call when a harvest is needed.
---

# rescueAssets

## Description

Rescues assets stuck on the vault. Callable only by the vault admin. If the vault state is out of date,
`updateState` is automatically prepended to the multicall.

## Arguments

| Name         | Type     | Required | Description                                       |
|--------------|----------|----------|---------------------------------------------------|
| userAddress  | `string` | **Yes**  | The address of the vault admin sending the transaction |
| vaultAddress | `string` | **Yes**  | The address of the vault                          |

## Example

```ts
const params = {
  vaultAddress: '0x...',
  userAddress: '0x...',
}

// Send transaction
const hash = await sdk.vault.rescueAssets(params)

// Wait for the transaction to be confirmed and indexed
await sdk.provider.waitForTransaction(hash)
await sdk.utils.waitForSubgraph({ hash })

// When you sign transactions on the backend (for custodians)
const { data, to } = await sdk.vault.rescueAssets.encode(params)
// Get an approximate gas per transaction
const gas = await sdk.vault.rescueAssets.estimateGas(params)
```
