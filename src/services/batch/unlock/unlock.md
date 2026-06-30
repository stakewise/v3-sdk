---
id: unlock
slug: /sdk/api/batch/unlock
description: Use the StakeWise SDK batch unlock method to unboost osToken in a single transaction.
---

#### Description:

Unboost your osToken in a single transaction

If the wallet doesn't support batching, use the regular [sdk.boost.unlock](/sdk/api/boost/transactions/unlock) instead.

#### Arguments:

| Name                 | Type                   | Required | Description                                                                                                                                                                                                            |
|----------------------|------------------------|----------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| percent              | `number`               | **Yes**  | The percent of the boosted position to unboost. Must be in the range `(0, 100)` - strictly greater than 0 and at most 100. The SDK throws before sending the transaction if `percent` is `0` or below, or above `100`  |
| userAddress          | `string`               | **Yes**  | The user address                                                                                                                                                                                                       |
| vaultAddress         | `string`               | **Yes**  | The address of the vault                                                                                                                                                                                               |
| leverageStrategyData | `LeverageStrategyData` | **No**   | Leverage strategy data from [sdk.boost.getLeverageStrategyData](/sdk/api/boost/requests/getleveragestrategydata). If not provided, it will be fetched automatically                                                    |

```ts
type LeverageStrategyData = {
  version: number
  isRequired: boolean
}
```

#### Example:

```ts
const params = {
  percent: 100,
  userAddress: '0x...',
  vaultAddress: '0x...',
}

// Check whether the wallet can send the batch itself (EIP-5792)
const isTxBatchSupported = await sdk.utils.checkTxBatchSupported({ userAddress: '0x...' })

if (isTxBatchSupported) {
  // Send the batch through the wallet
  const hash = await sdk.batch.unlock(params)
}

// Or get the calls to submit yourself (e.g. using Safe)
const { calls } = await sdk.batch.unlock.encode(params)
```
