---
id: claimRedeemerExitQueue
slug: /sdk/api/osToken/transactions/claimredeemerexitqueue
description: Use the StakeWise SDK claimRedeemerExitQueue method to withdraw exited assets from the OsTokenRedeemer exit queue for a specific user.
---

#### Description:

Withdraws exited assets from the OsTokenRedeemer queue.

#### Arguments:

| Name        | Type     | Required | Description                                                    |
|-------------|----------|----------|----------------------------------------------------------------|
| userAddress | `string` | **Yes**  | The user address                                               |
| positions   | `Array`  | **Yes**  | Claimable positions (`positionTicket` + `exitQueueIndex`)      |

#### Returns:

Transaction hash.

#### Example:

```ts
const { positions } = await sdk.osToken.getRedeemerExitQueuePositions({ userAddress: '0x...' })

await sdk.osToken.claimRedeemerExitQueue({
  userAddress: '0x...',
  positions,
})
```
