---
id: claimExitedAssets
slug: /sdk/api/osToken/transactions/claimexitedassets
description: Use the StakeWise SDK osToken claimExitedAssets method to claim the assets that exited the OsTokenRedeemer queue.
---

#### Description:

Claims the assets that have exited the OsTokenRedeemer queue for a given position ticket. Use `osTokenRedeemer.getExitQueueIndex` and `calculateExitedAssets` to obtain the exit queue index and check the claimable amount before calling.

#### Arguments:

| Name           | Type     | Required | Description                          |
|----------------|----------|----------|--------------------------------------|
| positionTicket | `bigint` | **Yes**  | The exit queue position ticket       |
| exitQueueIndex | `bigint` | **Yes**  | The exit queue index for the ticket  |
| userAddress    | `string` | **Yes**  | The user address                     |
| vaultAddress   | `string` | **Yes**  | The address of the vault             |

#### Example:

```ts
const params = {
  positionTicket: 0n,
  exitQueueIndex: 0n,
  userAddress: '0x...',
  vaultAddress: '0x...',
}

// Send transaction
const hash = await sdk.osToken.claimExitedAssets(params)

// Wait for the transaction to be confirmed and indexed
await sdk.provider.waitForTransaction(hash)
await sdk.utils.waitForSubgraph({ hash })

// When you sign transactions on the backend (for custodians)
const { data, to } = await sdk.osToken.claimExitedAssets.encode(params)
// Get an approximate gas per transaction
const gas = await sdk.osToken.claimExitedAssets.estimateGas(params)
```
