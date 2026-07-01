---
id: lock
slug: /sdk/api/batch/lock
description: Use the StakeWise SDK batch lock method to boost osToken in a single transaction.
---

#### Description:

Boost your osToken in a single transaction

If the wallet doesn't support batching, use the regular [sdk.boost.lock](/sdk/api/boost/transactions/lock) instead.

#### Arguments:

| Name                 | Type                   | Required | Description                                                                                                                                            |
|----------------------|------------------------|----------|------------------------------------------------------------------------------------------------------------------------------------------------------|
| amount               | `bigint`               | **Yes**  | Boost amount                                                                                                                                          |
| userAddress          | `string`               | **Yes**  | The user address                                                                                                                                     |
| vaultAddress         | `string`               | **Yes**  | The address of the vault                                                                                                                            |
| referrerAddress      | `string`               | **No**   | The address of the referrer                                                                                                                         |
| leverageStrategyData | `LeverageStrategyData` | **No**   | Leverage strategy data from [sdk.boost.getLeverageStrategyData](/sdk/api/boost/requests/getleveragestrategydata). If not provided, it will be fetched automatically |

```ts
type LeverageStrategyData = {
  version: number
  isUpgradeRequired: boolean
}
```

#### Example:

```ts
const params = {
  amount: parseEther('1'),
  userAddress: '0x...',
  vaultAddress: '0x...',
}

// Check whether the wallet can send the batch itself (EIP-5792)
const isTxBatchSupported = await sdk.utils.checkTxBatchSupported({ userAddress: '0x...' })

if (isTxBatchSupported) {
  // Send the batch through the wallet
  const hash = await sdk.batch.lock(params)
}

// Or get the calls to submit yourself (e.g. using Safe)
const { calls } = await sdk.batch.lock.encode(params)
```
