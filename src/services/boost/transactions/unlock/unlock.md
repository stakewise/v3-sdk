---
id: unlock
slug: /sdk/api/boost/transactions/unlock
description: Use the StakeWise SDK boost unlock method to unboost previously boosted osTokens by specifying a percentage to release.
---

#### Description:

Unboost your boosted osToken

#### Arguments:

| Name                 | Type       | Required | Description                                         |
|----------------------|------------|----------|-----------------------------------------------------|
| percent              | `number`   | **Yes**  | The percent of the boosted position to unboost. Must be in the range `(0, 100]` - strictly greater than 0 and at most 100. The SDK throws before sending the transaction if `percent` is `0` or below, or above `100`. |
| userAddress          | `string`   | **Yes**  | The user address                                    |
| vaultAddress         | `string`   | **Yes**  | The address of the vault where the osTokens boosted |
| leverageStrategyData | `LeverageStrategyData` | **No**  | Leverage strategy data from [sdk.boost.getLeverageStrategyData](/sdk/api/boost/requests/getleveragestrategydata). If not provided, it will be fetched automatically during the transaction |

```ts
type LeverageStrategyData = {
  version: number
  isRequired: boolean
}
```

#### Example:

```ts
const leverageStrategyData = await sdk.boost.getLeverageStrategyData({
  userAddress: '0x...',
  vaultAddress: '0x...',
})

const params = {
  percent: 100,
  userAddress: '0x...',
  vaultAddress: '0x...',
  leverageStrategyData,
}

// Send transaction
const hash = await sdk.boost.unlock(params)

// Wait for the transaction to be confirmed and indexed
await sdk.provider.waitForTransaction(hash)
await sdk.utils.waitForSubgraph({ hash })

// When you sign transactions on the backend (for custodians)
// `lockTxData` will always be returned, while `upgradeLeverageStrategyTxData` will be returned if the leverage strategy contract upgrade is required
const { lockTxData, upgradeLeverageStrategyTxData } = await sdk.boost.unlock.encode(params)
// Get an approximate gas per transaction
const gas = await sdk.boost.unlock.estimateGas(params)
```
