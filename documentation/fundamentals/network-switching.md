---
id: network-switching
title: Switch networks at runtime
sidebar_position: 4
description: SDK instances are immutable per network. To switch from Mainnet to Gnosis (or back) at runtime, construct a new SDK and cache one instance per chain via a singleton factory. Listen on EIP-1193 chainChanged to react to wallet network changes.
---

# Switch networks at runtime


A `StakeWiseSDK` instance is bound to a single network for its lifetime. `sdk.network`, `sdk.config`, `sdk.provider`, and `sdk.contracts` are derived from the constructor's `network` argument. To switch from Mainnet to Gnosis at runtime construct a new instance.

## Singleton factory

Recreating the SDK on every render is wasteful and breaks request caching. Cache one instance per chain:

```typescript
import { BrowserProvider } from 'ethers'
import { StakeWiseSDK, Network } from '@stakewise/v3-sdk'

const sdkCache = new Map<Network, StakeWiseSDK>()

const rpcUrls: Record<Network, string> = {
  [Network.Mainnet]: 'https://main-rpc.io',
  [Network.Gnosis]: 'https://gnosis-rpc.io',
  [Network.Hoodi]: 'https://hoodi-rpc.io',
}

export const getSDK = (network: Network, provider?: BrowserProvider): StakeWiseSDK => {
  if (provider) {
    return new StakeWiseSDK({ network, provider })
  }

  const cached = sdkCache.get(network)
  if (cached) {
    return cached
  }

  const sdk = new StakeWiseSDK({
    network,
    endpoints: { web3: rpcUrls[network] },
  })

  sdkCache.set(network, sdk)

  return sdk
}
```

## Reacting to wallet `chainChanged`

When the user switches chains in MetaMask, listen on the EIP-1193 provider and rebuild the SDK on the new chain:

```typescript
import { BrowserProvider } from 'ethers'
import { StakeWiseSDK, Network } from '@stakewise/v3-sdk'

let sdk: StakeWiseSDK = new StakeWiseSDK({
  network: Network.Mainnet,
  provider: new BrowserProvider(window.ethereum),
})

const supportedNetworks = new Set([ Network.Mainnet, Network.Gnosis, Network.Hoodi ])

const handleChainChanged = (chainIdHex: string) => {
  const chainId = Number.parseInt(chainIdHex, 16)

  if (!supportedNetworks.has(chainId)) return

  sdk = new StakeWiseSDK({
    network: chainId,
    provider: new BrowserProvider(window.ethereum),
  })
}

window.ethereum?.on('chainChanged', handleChainChanged)
```
