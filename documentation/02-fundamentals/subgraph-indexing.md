---
id: subgraph-indexing
title: Wait for subgraph indexing
sidebar_position: 1
description: After every write transaction (deposit, withdraw, mint, burn, lock, unlock, createVault), poll the StakeWise subgraph with sdk.utils.waitForSubgraph before refetching read methods - otherwise data is stale.
---

# Wait for subgraph indexing


The SDK reads on-chain state from a subgraph (Graph Protocol indexer), which lags blockchain finality by 1-5 seconds. Calling any read method (`getVault`, `getStakeBalance`, `getExitQueuePositions`, etc.) right after a write returns stale data.

`sdk.utils.waitForSubgraph` polls until the tx is indexed, then resolves. Always await it between write and refetch.

## The canonical post-write flow

```typescript
import { BrowserProvider, parseEther } from 'ethers'
import { StakeWiseSDK, Network } from '@stakewise/v3-sdk'

const sdk = new StakeWiseSDK({
  network: Network.Mainnet,
  provider: new BrowserProvider(window.ethereum),
})

const txHash = await sdk.vault.deposit({
  vaultAddress: '0x...',
  userAddress: '0x...',
  assets: parseEther('1.0'),
  referrerAddress: '0x0000000000000000000000000000000000000000',
})

// 1. Wait for subgraph to index the tx (also covers receipt confirmation)
await sdk.utils.waitForSubgraph({ hash: txHash })

// 2. Now safe to refetch - subgraph reflects the deposit
const stake = await sdk.vault.getStakeBalance({
  vaultAddress: '0x...',
  userAddress: '0x...',
})
```

The helper polls `sdk.utils.getTransactions({ hash })` once per second until the tx is indexed. Subgraph fallback / retry on transient errors is handled by the SDK's own GraphQL fetch layer.

The returned object is an `AbortPromise<void>` (same shape as every other read in the SDK). Call `.abort()` on it to stop polling, the call is a no-op if the helper has already resolved.

## Cancelling on unmount (React)

Use the same ref-based pattern as the rest of the SDK - see [`useFetchList.ts`](https://github.com/stakewise/frontwise/blob/master/apps/web/src/views/VaultView/Modals/access/ListModal/util/useFetchList.ts) for the canonical example.

```typescript
import { useEffect, useRef, useState } from 'react'
import { StakeWiseSDK, Network } from '@stakewise/v3-sdk'

const sdk = new StakeWiseSDK({
  network: Network.Mainnet,
  endpoints: { web3: 'https://main-rpc.io' },
})

const useDepositFlow = (txHash: string | null) => {
  const promiseRef = useRef<ReturnType<typeof sdk.utils.waitForSubgraph> | null>(null)
  const [ ready, setReady ] = useState(false)

  useEffect(() => {
    if (!txHash) {
      return
    }

    promiseRef.current?.abort()
    promiseRef.current = sdk.utils.waitForSubgraph({ hash: txHash })

    promiseRef.current
      .then(() => setReady(true))
      .catch((error) => console.error(error))

    return () => promiseRef.current?.abort()
  }, [ txHash ])

  return ready
}
```

`.abort()` suppresses any pending success/failure callbacks, your `.then` / `.catch` will never fire after it, so you don't need a separate `if (!aborted)` check inside them.

## Common pitfalls

- **Calling `getStakeBalance` immediately after `sdk.vault.deposit()` returns the *old* balance.** Always await `waitForSubgraph` between the two.
- **Network changes during waiting.** When the user switches chains mid-poll, the SDK is bound to the previous network and the helper may keep polling the old subgraph. Call `.abort()` on the wait promise and recreate the SDK on the new chain.
- **`sdk.provider.waitForTransaction(hash)` is not enough.** That waits for receipt confirmation (block inclusion) but does not wait for subgraph indexing, there is typically a 1–5 second additional gap.
