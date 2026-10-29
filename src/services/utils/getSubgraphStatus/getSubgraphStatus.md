---
id: getSubgraphStatus
slug: /sdk/api/utils/getsubgraphstatus
description: Use the StakeWise SDK getSubgraphStatus utility to check how far the subgraph lags behind the network and whether it has indexing errors.
---

#### Description:

Returns the subgraph indexing status: the last indexed block, its lag behind the latest network block and the indexing errors flag.
A subgraph that stopped indexing (fatal error) keeps answering with stale data and no errors, `isOutdated` detects this case.

#### Arguments:

| Name          | Type     | Required | Description                                                                 |
|---------------|----------|----------|-----------------------------------------------------------------------------|
| maxLagSeconds | `number` | **No**   | The lag after which the subgraph is considered outdated. Defaults to `300` |

#### Returns:

```ts
type Output = {
  blockNumber: number
  headBlockNumber: number
  lagSeconds: number
  hasIndexingErrors: boolean
  isOutdated: boolean
}
```

| Name | Description |
|------|-------------|
| `blockNumber` | The last block indexed by the subgraph |
| `headBlockNumber` | The latest network block from the SDK provider |
| `lagSeconds` | The difference between the timestamps of the latest network block and the last indexed block |
| `hasIndexingErrors` | The subgraph has non-fatal indexing errors, its data may be inconsistent |
| `isOutdated` | `lagSeconds` is greater than `maxLagSeconds` |

#### Example:

```ts
const { isOutdated, hasIndexingErrors } = await sdk.utils.getSubgraphStatus()
```
