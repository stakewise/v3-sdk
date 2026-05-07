---
id: network-switching
title: Switch networks at runtime
sidebar_position: 3
description: StakeWise SDK instances are immutable per network. To switch from Mainnet to Gnosis (or back) at runtime, construct a new SDK instance, use the singleton factory pattern to avoid recreating SDKs on every render.
---

# Switch networks at runtime


A `StakeWiseSDK` instance is **bound to a single network** for its lifetime. Properties like `sdk.network`, `sdk.config`, `sdk.provider`, and `sdk.contracts` are all derived from the network passed to the constructor. To switch from Mainnet to Gnosis at runtime, you construct a new SDK instance, the old one is then discarded.

## Recommended: singleton factory

Recreating the SDK on every render is wasteful and breaks request caching. Cache one instance per `(network, signer-or-no-signer)` key:

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
  // Wallet-bound SDKs are not cached, caller may swap accounts
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

## Switching the active network

```typescript
import { Network } from '@stakewise/v3-sdk'

let activeNetwork = Network.Mainnet
let sdk = getSDK(activeNetwork)

const switchTo = (network: Network) => {
  activeNetwork = network
  sdk = getSDK(network)
}

switchTo(Network.Gnosis)
const gnosisStats = await sdk.utils.getStakewiseStats()
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

  if (!supportedNetworks.has(chainId)) return // unsupported network, app can show a switch-network prompt

  sdk = new StakeWiseSDK({
    network: chainId,
    provider: new BrowserProvider(window.ethereum),
  })
}

window.ethereum?.on('chainChanged', handleChainChanged)
```

## Immutability

`sdk.config` is computed once at construction and contains chain-specific contract addresses, GraphQL URLs, native token symbol, and `osToken` symbol. Mutating `sdk.network` does not propagate to these, every read and contract call still targets the original chain. Recreate to switch.

## Multi-chain queries

To query multiple chains in parallel (e.g. cross-chain TVL), instantiate one SDK per chain and run them concurrently. `sdk.utils.getStakewiseStats()` returns the network-wide aggregate so you can compare totals across chains:

```typescript
import { formatEther } from 'ethers'
import { StakeWiseSDK, Network } from '@stakewise/v3-sdk'

const mainnet = new StakeWiseSDK({
  network: Network.Mainnet,
  endpoints: { web3: 'https://main-rpc.io' },
})

const gnosis = new StakeWiseSDK({
  network: Network.Gnosis,
  endpoints: { web3: 'https://gnosis-rpc.io' },
})

const [ mainnetStats, gnosisStats ] = await Promise.all([
  mainnet.utils.getStakewiseStats(),
  gnosis.utils.getStakewiseStats(),
])

console.log(`Mainnet TVL: ${formatEther(mainnetStats.totalAssets)} ETH`)
console.log(`Gnosis TVL: ${formatEther(gnosisStats.totalAssets)} GNO`)
```
