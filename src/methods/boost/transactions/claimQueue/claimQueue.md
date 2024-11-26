---
id: claimQueue
slug: /boost/transactions/claimqueue
---

#### Description:

Claim user unboost queue

#### Arguments:

| Name         | Type           | Required | Description                                         |
|--------------|----------------|----------|-----------------------------------------------------|
| position     | `Position`     | **Yes**  | position field from boost.getQueuePosition          |
| userAddress  | `string`       | **Yes**  | The user address                                    |
| vaultAddress | `string`       | **Yes**  | The address of the vault where the osTokens boosted |

#### Example:

```ts
const params = {
  userAddress: '0x...',
  vaultAddress: '0x...',
}

const { position } = await sdk.boost.getQueuePosition(params)

if (!isClaimable) {
  return
}

// Send transaction
const hash = await sdk.boost.claimQueue({ ...params, position })
// When you sign transactions on the backend (for custodians)
const { data, to, value } = await sdk.boost.claimQueue.encode({ ...params, position })
// Get an approximate gas per transaction
const gas = await sdk.boost.claimQueue.estimateGas({ ...params, position })
```
