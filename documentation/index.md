---
id: overview
title: Overview
sidebar_position: 0
---

# Overview

The SDK provides an API for interacting with a **Vault**, allowing you to create and manage vaults, fetch user balances for stakers, and send blockchain transactions related to the vault. With this SDK, you can easily build and integrate your own vault interface.

The SDK is written in **TypeScript** and is designed to remain lightweight — we carefully avoid adding unnecessary dependencies.  
To use the SDK, you must have the **ethers** library installed, version **6.14.3 or higher**.

The SDK retrieves data from both **subgraphs** and **on-chain smart contracts**, and it can also **send transactions** if you pass a provider instance connected to the user's wallet.

---

## Data Sources & Transactions

- **Data Fetching**: Queries subgraphs and smart contracts for real-time information
- **Transaction Execution**: Sends transactions when provided with a wallet-connected provider

---

## Supported Networks

The SDK currently supports:

- **Ethereum Mainnet**
- **Hoodi Testnet**
- **Gnosis Network**

You can specify the target network when creating the SDK instance.

---

## Configuration

We strongly recommend providing your own RPC endpoints for reliability and rate limiting. This is done via the `endpoints.web3` argument during initialization.

You can provide endpoints in several formats:

*   A single URL string.
*   Multiple URLs as an array of strings (for fallback providers).
*   An array of objects to include custom headers (e.g., for authenticated RPC endpoints).


```typescript
import { StakeWiseSDK, Network } from '@stakewise/v3-sdk'

const sdk = new StakeWiseSDK({
  network: Network.Mainnet,
  endpoints: {
    web3: [
      "https://main-rpc.io",
      "https://fallback-rpc.io",
    ]
  }
})
```

---

## Prerequisites

- **Ethers Library:** Version 6.14.3 or higher is required.
- **GraphQL Support** Your bundler must be configured to handle `.graphql` and `.gql` file extensions

---

## Transaction Flexibility

The SDK supports both **client-side** (browser wallet) and **backend** (custodial) transaction execution. Each write method provides three execution patterns:

| Method | Description | Use Case |
|--------|-------------|----------|
| `sdk.vault.method(...)` | Direct transaction sending | Browser wallets & quick executions |
| `sdk.vault.method.encode(...)` | Returns encoded calldata | Custom transaction building & custodial wallets |
| `sdk.vault.method.estimateGas(...)` | Estimates gas costs | cost calculation |

---

## Aborting Data Requests

Most data-fetching methods in the SDK return a **promise-like object** that includes built-in control methods such as `abort()`.

This allows you to safely cancel network requests that are no longer relevant — for example, when a user changes a filter or input before the previous request completes.

When `abort()` is called, the ongoing network request is **canceled**, and the associated promise will **not resolve or reject**.  
If the request has already finished, calling `abort()` has **no effect**.

### Example

```ts
const promise = sdk.vault.getUserApy({
  userAddress,
  vaultAddress,
})

// Cancel the ongoing request
promise.abort()
```
