---
id: claimQueue
slug: /boost/transactions/claimqueue
---

#### Description:

Claim user unboost queue

#### Arguments:

| Name                    | Type       | Required | Description                                                                                         |
|-------------------------|------------|----------|-----------------------------------------------------------------------------------------------------|
| position                | `Position` | **Yes**  | position field from boost.getQueuePosition                                                          |
| userAddress             | `string`   | **Yes**  | The user address                                                                                    |
| vaultAddress            | `string`   | **Yes**  | The address of the vault where the osTokens boosted                                                 |
| leverageStrategyVersion | `1 \|\| 2` | **No**   | Leverage strategy version. If not provided, it will be fetched automatically during the transaction |

#### Example:

```ts
const queryParams = {
  userAddress: '0x...',
  vaultAddress: '0x...',
}

const { position, version: leverageStrategyVersion } = await sdk.boost.getQueuePosition(queryParams)

if (!isClaimable) {
  return
}

const params = {
  ...queryParams,
  position,
  leverageStrategyVersion,
}

// Send transaction
const hash = await sdk.boost.claimQueue(params)
// When you sign transactions on the backend (for custodians)
const { data, to, value } = await sdk.boost.claimQueue.encode(params)
// Get an approximate gas per transaction
const gas = await sdk.boost.claimQueue.estimateGas(params)
```
