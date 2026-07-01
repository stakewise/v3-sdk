---
id: depositAndBoost
slug: /sdk/api/batch/depositandboost
description: Use the StakeWise SDK batch depositAndBoost method to deposit and boost osToken in a single transaction.
---

#### Description:

Deposit (stake) and boost osToken in a single transaction

By default it mints the maximum osToken for the deposit and boosts all of it.

If the wallet doesn't support batching, use the regular [sdk.vault.deposit](/sdk/api/vault/transactions/deposit),
[sdk.osToken.mint](/sdk/api/osToken/transactions/mint) then [sdk.boost.lock](/sdk/api/boost/transactions/lock) instead.

#### Arguments:

| Name                 | Type                   | Required | Description                                                                                                          |
|----------------------|------------------------|----------|--------------------------------------------------------------------------------------------------------------------|
| assets               | `bigint`               | **Yes**  | The amount of the deposit token (e.g. ETH) to deposit                                                               |
| userAddress          | `string`               | **Yes**  | The user address                                                                                                   |
| vaultAddress         | `string`               | **Yes**  | The address of the vault                                                                                           |
| receiveShares        | `bigint`               | **No**   | The amount of osToken to mint. Defaults to the maximum mintable for the deposit                                     |
| boostShares          | `bigint`               | **No**   | The amount of osToken to boost. Defaults to `receiveShares` (boosts everything minted)                              |
| referrerAddress      | `string`               | **No**   | The address of the referrer                                                                                        |
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
  assets: parseEther('1'),
  userAddress: '0x...',
  vaultAddress: '0x...',
}

// Check whether the wallet can send the batch itself (EIP-5792)
const isTxBatchSupported = await sdk.utils.checkTxBatchSupported({ userAddress: '0x...' })

if (isTxBatchSupported) {
  // Send the batch through the wallet
  const hash = await sdk.batch.depositAndBoost(params)
}

// Or get the calls to submit yourself (e.g. using Safe)
const { calls } = await sdk.batch.depositAndBoost.encode(params)
```
