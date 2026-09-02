---
id: redeemerWithdraw
slug: /sdk/api/osToken/transactions/redeemerwithdraw
description: Use the StakeWise SDK osToken redeemerWithdraw method to redeem osToken through the OsTokenRedeemer exit queue.
---

#### Description:

Enters the OsTokenRedeemer exit queue with your osToken shares. The osToken must be approved to the OsTokenRedeemer contract (or use a permit) before calling. Returns a transaction hash; the position ticket is emitted in the `ExitQueueEntered` event.

#### Arguments:

| Name         | Type     | Required | Description               |
|--------------|----------|----------|---------------------------|
| shares       | `bigint` | **Yes**  | osToken shares to redeem  |
| userAddress  | `string` | **Yes**  | The user address          |
| vaultAddress | `string` | **Yes**  | The address of the vault  |

#### Example:

```ts
const params = {
  shares: 0n,
  userAddress: '0x...',
  vaultAddress: '0x...',
}

// Send transaction
const hash = await sdk.osToken.redeemerWithdraw(params)

// Wait for the transaction to be confirmed and indexed
await sdk.provider.waitForTransaction(hash)
await sdk.utils.waitForSubgraph({ hash })

// When you sign transactions on the backend (for custodians)
const { data, to } = await sdk.osToken.redeemerWithdraw.encode(params)
// Get an approximate gas per transaction
const gas = await sdk.osToken.redeemerWithdraw.estimateGas(params)
```
