---
id: unlock
slug: /boost/transactions/unlock
---

#### Description:

Unboost your boosted osToken

#### Arguments:

| Name         | Type           | Required | Description                                         |
|--------------|----------------|----------|-----------------------------------------------------|
| percent      | `number`       | **Yes**  | The percent to unboost (100 at max)                 |
| userAddress  | `string`       | **Yes**  | The user address                                    |
| vaultAddress | `string`       | **Yes**  | The address of the vault where the osTokens boosted |

#### Example:

```ts
const params = {
  percent: 100,
  userAddress: '0x...',
  vaultAddress: '0x...',
}

// Send transaction
const hash = await sdk.boost.unlock(params)
// When you sign transactions on the backend (for custodians)
const { data, to, value } = await sdk.boost.unlock.encode(params)
// Get an approximate gas per transaction
const gas = await sdk.boost.unlock.estimateGas(params)
```
