---
id: upgradeLeverageStrategy
slug: /boost/transactions/upgradeleveragestrategy
---

#### Description:

Upgrade leverage strategy contract

#### Arguments:

| Name         | Type     | Required | Description                                                            |
|--------------|----------|----------|------------------------------------------------------------------------|
| userAddress  | `string` | **Yes**  | The user address                                                       |
| vaultAddress | `string` | **Yes**  | The address of the vault where the osTokens boosted or will be boosted |


#### Example:

```ts
const params = {
  userAddress: '0x...',
  vaultAddress: '0x...',
}

// Send transaction
const hash = await sdk.boost.upgradeLeverageStrategy(params)
// When you sign transactions on the backend (for custodians)
const { data, to, value } = await sdk.boost.unlock.encode(params)
// Get an approximate gas per transaction
const gas = await sdk.boost.unlock.estimateGas(params)
```
