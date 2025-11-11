---
id: installation-setup
title: Installation and Setup
sidebar_position: 1
---

## Installation

Install the SDK using **npm** or **yarn**:

```bash
npm install @stakewise/v3-sdk
# or
yarn add @stakewise/v3-sdk
```

---

## GraphQL Loader Setup

The SDK includes `.graphql` queries. If your build tool does not natively support importing `.graphql` files, you’ll need to install and configure a corresponding plugin.

### `Webpack Configuration`

```ts
// webpack.config.js
module.exports = {
  module: {
    rules: [
      {
        test: /\.(graphql|gql)$/,
        exclude: /node_modules/,
        loader: 'graphql-tag/loader'
      }
    ]
  }
}
```

### `Next.js Configuration`

```ts
// next.config.js
module.exports = {
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(graphql|gql)$/,
      loader: 'graphql-tag/loader',
      exclude: /node_modules/,
    })
    return config
  }
}
```

### `Vite Configuration`

```ts
// vite.config.js
import graphql from '@rollup/plugin-graphql'

export default {
  plugins: [graphql()]
}
```

💡 If you are using another bundler, search for “GraphQL loader” or “GraphQL plugin” for your specific build system.

---

## Creating an SDK Instance

### 1. Without a Provider (read-only mode + encoding)

Perfect for:
- Frontend read-only operations
- Custodial wallet backends (using encoded transactions)
- Data dashboards without transaction capabilities

However, you **cannot send transactions** (e.g., `sdk.vault.deposit`), but you can get **transaction calldata** (`sdk.vault.deposit.encode`)

```ts
import { StakeWiseSDK, Network } from '@stakewise/v3-sdk'

const sdk = new StakeWiseSDK({
  network: Network.Mainnet,
  endpoints: {
    web3: 'https://mainnet.infura.io/v3/...',
  },
})
```
---

### 2. With a Provider (read + write mode)

Perfect for:
- Browser wallet integrations (MetaMask, WalletConnect, etc.)
- Direct transaction execution

An SDK instance created **with a provider** allows both **data fetching** and **transaction execution**.

```ts
import { BrowserProvider } from 'ethers'
import { StakeWiseSDK, Network } from '@stakewise/v3-sdk'

const eip1193Provider = window.ethereum

const browserProvider = new BrowserProvider(eip1193Provider, {
  chainId: Network.Mainnet,
  name: 'mainnet',
})

const sdk = new StakeWiseSDK({
  network: Network.Mainnet,
  provider: browserProvider,
})
```

---

### 3. With Wagmi Connector and React

If you’re using **wagmi** for wallet connections, you can initialize the SDK with an existing wagmi connector.

🔗 A full working example can be found on  
**[Example of connecting the SDK with the Wagmi library](https://stackblitz.com/edit/stakewise-sdk?file=src%2Fcomponents%2Futil%2Findex.ts,src%2Fcomponents%2FConnect.tsx,src%2Fcomponents%2FSdkContext.tsx,src%2Fcomponents%2Futil%2FinitContext.ts,src%2Fwagmi.ts,src%2FApp.tsx,src%2Fcomponents%2FConnectWallet.tsx,src%2Fcomponents%2FAccount.tsx)**

```ts
import React, { useCallback } from 'react'
import { BrowserProvider, Eip1193Provider } from 'ethers'
import { StakeWiseSDK, Network } from '@stakewise/v3-sdk'
import { useAccount } from 'wagmi'

const useStakeWiseSDK = async () => {
  const { address, connector } = useAccount()

  const createSDK = useCallback(async () => {
    if (!address || typeof connector?.getProvider !== 'function') {
      return new StakeWiseSDK({ network: Network.Mainnet })
    }

    const library = await connector.getProvider() as Eip1193Provider

    return new StakeWiseSDK({
      network: Network.Mainnet,
      provider: new BrowserProvider(library, {
        chainId: Network.Mainnet,
        name: 'mainnet',
      }),
    })
  }, [])

  return createSDK
}
```
---

## SDK Constructor Options

| Name | Type | Required | Description |
|------|------|-----------|-------------|
| **network** | `Network` | ✅ Yes | Chain ID to connect the SDK instance to. |
| **provider** | `BrowserProvider` or `JsonRpcProvider` | No | Custom ethers provider instance. Required to send transactions. |
| **endpoints.web3** | `string` or `Array<string>` or `Array<{ url: string, headers: Headers }>` | No | Custom RPC endpoints for blockchain access. Required if `provider` is not provided. Multiple URLs are used as fallbacks. |
| **endpoints.subgraph** | `string` | No | Optional custom URL for the StakeWise subgraph. |
| **endpoints.api** | `string` | No | Optional custom URL for the StakeWise backend API. |

---

✅ **Tip:** For production environments, we recommend passing your own RPC endpoints instead of public ones to ensure reliability and rate-limit control.
