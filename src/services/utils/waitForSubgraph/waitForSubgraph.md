---
id: waitForSubgraph
slug: /sdk/api/utils/waitforsubgraph
description: Use the StakeWise SDK waitForSubgraph utility to poll the subgraph after a write transaction until indexing catches up, so the next read returns fresh data instead of pre-tx state.
---

#### Description:

Polls the subgraph until a transaction with the given hash is indexed. Required after every write operation (`deposit`, `withdraw`, `mint`, `burn`, `lock`, `unlock`, `createVault`) before refetching read methods, otherwise the subgraph returns stale data because it indexes blocks asynchronously.

`sdk.provider.waitForTransaction(hash)` waits for the receipt only, not for subgraph indexing. There is typically a 1 to 5 second additional gap.

#### Arguments:

| Name          | Type     | Required | Description                                                    |
|---------------|----------|----------|----------------------------------------------------------------|
| `hash`        | `string` | **Yes**  | Transaction hash returned by the write call                    |
| `maxAttempts` | `number` | No       | Max retry attempts on transient subgraph errors (default `10`) |
| `pollDelay` | `number` | No       | Delay between polls in ms (default `1000`)                     |

#### Returns:

`AbortPromise<void>` — call `.abort()` to stop polling on unmount or navigation.

#### Example:

```ts
const txHash = await sdk.vault.deposit({
  vaultAddress: '0x...',
  userAddress: '0x...',
  assets: 1_000_000_000_000_000_000n,
  referrerAddress: '0x0000000000000000000000000000000000000000',
})

await sdk.utils.waitForSubgraph({ hash: txHash })

// Now safe to refetch — subgraph reflects the deposit
const stake = await sdk.vault.getStakeBalance({
  vaultAddress: '0x...',
  userAddress: '0x...',
})
```

#### Aborting:

```ts
const promise = sdk.utils.waitForSubgraph({ hash: txHash })

promise.then(() => refetch())

// On unmount / navigation
promise.abort()
```
