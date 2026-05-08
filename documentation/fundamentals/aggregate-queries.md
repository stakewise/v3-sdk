---
id: aggregate-queries
title: Network-wide aggregates
sidebar_position: 3
description: Use sdk.utils.getStakewiseStats() to fetch total ETH staked, user count, and total earned rewards across all StakeWise V3 vaults on the configured chain.
---

# Network-wide aggregates


To answer "how much is staked across all StakeWise V3 vaults?" use `sdk.utils.getStakewiseStats()`. It returns the protocol-wide aggregate for the network the SDK is bound to.

## Total ETH staked across all V3 vaults

```typescript
import { formatEther } from 'ethers'
import { StakeWiseSDK, Network } from '@stakewise/v3-sdk'

const sdk = new StakeWiseSDK({
  network: Network.Mainnet,
  endpoints: { web3: 'https://main-rpc.io' },
})

const stats = await sdk.utils.getStakewiseStats()

console.log(`Total: ${formatEther(stats.totalAssets)} ETH`)
console.log(`Users: ${stats.usersCount}`)
console.log(`Earned: ${formatEther(stats.totalEarnedAssets)} ETH`)
```

`stats.totalAssets` and `stats.totalEarnedAssets` are wei strings; convert with `BigInt` for math, with `formatEther` for display. On Gnosis swap `Network.Mainnet` for `Network.Gnosis` and the value is in GNO.

## Cross-chain TVL

Instantiate one SDK per chain, run them concurrently:

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
