---
id: rescueAssets
slug: /sdk/api/vault/transactions/rescueassets
description: Use the StakeWise SDK rescueAssets method to let a vault admin rescue stuck assets from the vault. State is updated as part of the call when required.
---

#### Description:

Rescues assets accidentally sent to the vault. Can only be called by the vault **admin**. Automatically bundles the call with `updateState` when the vault has pending rewards to harvest.

#### Arguments:

| Name         | Type     | Required | Description                                                       |
|--------------|----------|----------|-------------------------------------------------------------------|
| userAddress  | `string` | **Yes**  | The address calling the transaction. Must be the vault admin      |
| vaultAddress | `string` | **Yes**  | The address of the vault                                          |

#### Example:

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
