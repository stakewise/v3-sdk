---
id: sdk-reference
title: SDK Reference
sidebar_position: 2
---

# Configuration for the Current Network

For each network, the SDK stores configuration containing essential data for working with the current network.

You can access the current configuration in one of the following ways:

- Access through the SDK instance: `sdk.config`
- Import configurations for all networks: `import { configs } from '@stakewise/v3-sdk'`

The configuration contains the following data:

- **network** - data about the current network
- **api** - GraphQL URLs for data retrieval
- **addresses** - addresses of main contracts operating in the network
- **tokens** - token symbols for the current network

# Global Types

The SDK adds the `StakeWise` namespace to the global scope, from which you can access necessary data types.

- **StakeWise.Config** - network configuration type
- **StakeWise.Contracts** - types for ethers contracts built into the SDK
- **StakeWise.Provider** - supported provider type for SDK initialization
- **StakeWise.ABI** - additional namespace containing types for all contracts based on their ABI
- **StakeWise.Services** - additional namespace for accessing types of main SDK methods. Contains class descriptions for: Vault, Boost, Utils, OsToken, RewardSplitter, DistributorRewards

To get the return type of the `sdk.boost.getData` method, you can use two approaches:

```typescript
// First approach
type BoostData = Awaited<ReturnType<typeof sdk.boost.getData>>

// Second approach
type BoostData = Awaited<ReturnType<StakeWise.Services.BoostService['getData']>>
```

# Contracts

You can make calls to the built-in ethers contracts if needed. To access contracts for the current network, use `sdk.contracts`.

For example, if you want to quickly create a standard ERC20 contract, you can use the helper `sdk.contracts.helpers.createErc20(tokenAddress)`.
