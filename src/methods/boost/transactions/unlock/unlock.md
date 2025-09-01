---
id: unlock
slug: /boost/transactions/unlock
---

#### Description:

Unboost your boosted osToken

#### Arguments:

| Name                 | Type       | Required | Description                                         |
|----------------------|------------|----------|-----------------------------------------------------|
| percent              | `number`   | **Yes**  | The percent to unboost (100 at max)                 |
| userAddress          | `string`   | **Yes**  | The user address                                    |
| vaultAddress         | `string`   | **Yes**  | The address of the vault where the osTokens boosted |
| leverageStrategyData | `LeverageStrategyData` | **No**  | Leverage strategy data from [sdk.boost.getLeverageStrategyData](/boost/requests/getleveragestrategydata). If not provided, it will be fetched automatically during the transaction |

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
// When you sign transactions on the backend (for custodians)
// `lockTxData` will always be returned, while `upgradeLeverageStrategyTxData` will be returned if the leverage strategy contract upgrade is required
const { lockTxData, upgradeLeverageStrategyTxData } = await sdk.boost.unlock.encode(params)
// Get an approximate gas per transaction
const gas = await sdk.boost.unlock.estimateGas(params)
```
