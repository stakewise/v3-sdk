---
id: sdk-reference
title: SDK Reference
sidebar_position: 2
description: StakeWise SDK reference for network configuration, global TypeScript types, contract access, and built-in ethers helpers.
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

# Error Handling and Transaction Debugging
Each SDK method validates the arguments passed to it before execution and throws an error if any argument is invalid. For example, if you attempt to send a transaction without providing a provider during SDK initialization, an error will be thrown.
If an error occurs during a transaction, you will see a detailed error logged in the console, including the transaction data. If the error object contains a `solidityError` field, it means the error was successfully parsed and the root cause is immediately visible.
If the `solidityError` field is not present, the error log will still include the `data`, `to`, and `from` fields. Using these values, you can reproduce and debug the transaction with Tenderly:
1. Open Tenderly and go to the Simulator section.
2. Select the appropriate network.
3. Paste the `to` address into the left column (the contract address field).
4. Paste the value from the `data` field into Raw input data.
5. Paste the `from` address into the From field on the right.
6. Disable Use Pending Block.
7. Enter the current block number into the Block Number field.
After running the simulation, you will see the exact error that occurred in the smart contract, making it significantly easier to understand and resolve the issue.
