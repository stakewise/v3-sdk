---
id: claimExitQueue
slug: /vault/transactions/claimexitqueue
---

#### Description:

Withdraws exited assets from the queue.

#### Arguments:

| Name         | Type     | Required | Description                                                                              |
|--------------|----------|----------|------------------------------------------------------------------------------------------|
| positions    | `string` | **Yes**  | `postions` from [sdk.vault.getExitQueuePositions](/vault/requests/getexitqueuepositions) |
| userAddress  | `string` | **Yes**  | The user address                                                                         |
| vaultAddress | `string` | **Yes**  | The address of the vault                                                                 |

#### Example:

```ts
const exitQueue = await sdk.vault.getExitQueuePositions({
  vaultAddress: '0x...',
  userAddress: '0x...',
})

if (!exitQueue.withdrawable) {
  // The exit queue has not yet accumulated funds for withdrawal
  return
}

if (!exitQueue.data.length) {
  // No withdrawal positions
  return
}

const params = {
  positions: exitQueue.data,
  vaultAddress: '0x...',
  userAddress: '0x...',
}

// Send transaction
const hash = await sdk.vault.claimExitQueue(params)
// When you sign transactions on the backend (for custodians)
const { data, to } = await sdk.vault.claimExitQueue.encode(params)
// Get an approximate gas per transaction
const gas = await sdk.vault.claimExitQueue.estimateGas(params)
```
