---
id: waitForSubgraph
slug: /sdk/api/utils/waitforsubgraph
description: Use the StakeWise SDK waitForSubgraph utility to poll the subgraph after a write transaction until indexing catches up, so the next read returns fresh data instead of pre-tx state.
---

#### Description:

Polls the subgraph until a transaction with the given hash is indexed. Required after every write operation (`deposit`, `withdraw`, `mint`, `burn`, `lock`, `unlock`, `createVault`) before refetching read methods - otherwise the subgraph returns stale data because it indexes blocks asynchronously.

`sdk.provider.waitForTransaction(hash)` waits for the receipt only, not for subgraph indexing. There is typically a 1 to 5 second additional gap.

#### Arguments:

| Name   | Type     | Required | Description                                 |
|--------|----------|----------|---------------------------------------------|
| `hash` | `string` | **Yes**  | Transaction hash returned by the write call |

#### Returns:

`AbortPromise<void>`. Call `.abort()` to stop polling on unmount or navigation.

#### Example:

```ts
await sdk.utils.waitForSubgraph({ hash: '0x...' })
```
