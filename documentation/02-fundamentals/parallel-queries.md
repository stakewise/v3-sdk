---
id: parallel-queries
title: Parallel reads with Promise.all
sidebar_position: 2
description: SDK read methods don't share state, fetch user balances, APY, boost, and exit queue concurrently with Promise.all instead of awaiting each one in sequence.
---

# Parallel reads with `Promise.all`


Read methods on the SDK are independent, they hit the subgraph and on-chain contracts directly without shared state. Awaiting them serially adds latency for no reason. Always batch independent reads with `Promise.all`.

## User dashboard load

A typical "user view" needs vault stats, the user's stake, osToken position, boost, and exit queue. Fetched serially that's 5 round-trips; in parallel it's the slowest single request:

```typescript
import { StakeWiseSDK, Network } from '@stakewise/v3-sdk'

const sdk = new StakeWiseSDK({
  network: Network.Mainnet,
  endpoints: { web3: 'https://main-rpc.io' },
})

const userAddress = '0x...'
const vaultAddress = '0x...'

const [
  vault,
  vaultStats,
  stake,
  osTokenBalance,
  maxMintShares,
  boostData,
  exitQueue,
] = await Promise.all([
  sdk.vault.getVault({ vaultAddress }),
  sdk.vault.getVaultStats({ vaultAddress }),
  sdk.vault.getStakeBalance({ vaultAddress, userAddress }),
  sdk.osToken.getBalance({ vaultAddress, userAddress }),
  sdk.osToken.getMaxMintAmount({ vaultAddress, userAddress }),
  sdk.boost.getData({ vaultAddress, userAddress }),
  sdk.vault.getExitQueuePositions({ vaultAddress, userAddress }),
])
```

## Combining with abort

Each SDK read returns an `AbortPromise`. Use `AbortPromise.all([ ... ])` (the SDK's parallel helper) to fan-out reads and abort them all in one call when the user navigates away:

```typescript
import { useEffect, useRef, useState } from 'react'
import { StakeWiseSDK, Network, AbortPromise } from '@stakewise/v3-sdk'

const sdk = new StakeWiseSDK({
  network: Network.Mainnet,
  endpoints: { web3: 'https://main-rpc.io' },
})

const useUserData = (vaultAddress: string, userAddress: string) => {
  const inflight = useRef<ReturnType<typeof AbortPromise.all> | null>(null)
  const [ data, setData ] = useState<null | { stake: bigint }>(null)

  useEffect(() => {
    inflight.current?.abort()

    inflight.current = AbortPromise.all([
      sdk.vault.getVault({ vaultAddress }),
      sdk.vault.getStakeBalance({ vaultAddress, userAddress }),
    ])

    inflight.current
      .then(([ vault, stake ]: any) => setData({ stake: stake.assets }))
      .catch((error: any) => console.error(error))

    return () => inflight.current?.abort()
  }, [ vaultAddress, userAddress ])

  return data
}
```

Calling `.abort()` on the result of `AbortPromise.all` aborts every member promise. After abort, neither `.then` nor `.catch` callbacks fire.

For finer-grained control, hold each individual promise in a ref array and abort selectively, the pattern frontwise uses for paginated lists is in [`useFetchList.ts`](https://github.com/stakewise/frontwise/blob/master/apps/web/src/views/VaultView/Modals/access/ListModal/util/useFetchList.ts).

## When NOT to parallelise

Conditional reads, where the second call depends on a value from the first, must be sequential. The classic case is fetching the whitelist only when a vault is private:

```typescript
import { StakeWiseSDK, Network } from '@stakewise/v3-sdk'

const sdk = new StakeWiseSDK({
  network: Network.Mainnet,
  endpoints: { web3: 'https://main-rpc.io' },
})

const vault = await sdk.vault.getVault({ vaultAddress: '0x...' })

const whitelist = vault.isPrivate
  ? await sdk.vault.getWhitelist({ vaultAddress: '0x...' })
  : []
```

## Avoid `Promise.all` for write operations

Writes need a wallet signature and most users sign one tx at a time. Don't run `sdk.vault.deposit` and `sdk.vault.withdraw` in parallel, wallet UIs serialize signing prompts anyway, and you'll hit nonce conflicts on a single signer.
