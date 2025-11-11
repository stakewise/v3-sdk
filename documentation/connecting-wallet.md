---
id: connecting
title: Connecting a Wallet
sidebar_position: 2
---

# Connecting a Wallet

To enable transaction capabilities (like `deposit`, `withdraw`, etc.), your application needs to connect a user's wallet to the SDK. This guide covers different connection strategies.

## EIP-1193 Provider Standard

The SDK uses the **[EIP-1193](https://eips.ethereum.org/EIPS/eip-1193)** provider standard for wallet connections. This is the common interface implemented by most Ethereum wallets.

```ts
interface Eip1193Provider {
  on(event: "connect", listener: (info: ProviderInfo) => void): void
  on(event: "message", listener: (message: ProviderMessage) => void): void
  on(event: "disconnect", listener: (error: ProviderRpcError) => void): void
  on(event: "chainChanged", listener: (chainId: ProviderChainId) => void): void
  on(event: "accountsChanged", listener: (accounts: ProviderAccounts) => void): void
  request(request: { method: string, params?: Array<any> | Record<string, any> }): Promise<any>
}
```

---

## Wallet Connection Types

Different wallets implement the EIP-1193 provider in different ways.  
The most common type is **injected wallets** — wallets that automatically inject a provider into the global `window` object under the `window.ethereum` property. This type of connection is used by wallets that are provided in the form of browsers or browser extensions, the most popular of which is **MetaMask**.

This is the simplest connection method and works out of the box for most browser wallets.

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

## Using Proxy Libraries (Recommended)

Some wallets provide their own SDKs or libraries to expose an EIP-1193 provider.  
However, if your application supports **multiple wallet types**, managing each wallet library individually and maintaining a unified interface can quickly become cumbersome.

To simplify integration, we recommend using a **proxy or aggregation library** that standardizes the connection layer and tracks wallet API changes.

A good example is **`Wagmi`** or **`RainbowKit`**.

🔗 A full working example can be found on  
**[Example of connecting the SDK with the Wagmi library](https://stackblitz.com/edit/stakewise-sdk?file=src%2Fcomponents%2Futil%2Findex.ts,src%2Fcomponents%2FConnect.tsx,src%2Fcomponents%2FSdkContext.tsx,src%2Fcomponents%2Futil%2FinitContext.ts,src%2Fwagmi.ts,src%2FApp.tsx,src%2Fcomponents%2FConnectWallet.tsx,src%2Fcomponents%2FAccount.tsx)**

---

## Direct Wallet Integration

For specific wallet integrations, here are common patterns:

### `Binance`

```ts
import { BrowserProvider } from 'ethers'
import { StakeWiseSDK, Network } from '@stakewise/v3-sdk'
import { getProvider } from '@binance/w3w-ethereum-provider'


const getBinanceProvider = async () => {
  const provider = getProvider({
    showQrCodeModal: true,
    lng: 'en-US,
    chainId: 1,
    rpc: {
      1: 'https://mainnet.infura.io/v3/...',
    },
  })

  await provider.enable()

  return provider
}

const eip1193Provider = await getBinanceProvider()

const browserProvider = new BrowserProvider(eip1193Provider, {
  chainId: Network.Mainnet,
  name: 'mainnet',
})

const sdk = new StakeWiseSDK({
  network: Network.Mainnet,
  provider: browserProvider,
})
```

### `WalletConnect v2`

```ts
import { BrowserProvider } from 'ethers'
import { StakeWiseSDK, Network } from '@stakewise/v3-sdk'
import { EthereumProvider } from '@walletconnect/ethereum-provider'


const getWalletConnectProvider = async () => {
  const provider = await EthereumProvider.init({
    projectId: 'WALLET_CONNECT_ID' // from account (https://walletconnect.com/)
    disableProviderPing: true,
    isNewChainsStale: true,
    optionalChains: [ 1 ],
    showQrModal: true,
    rpcMap: {
      1: 'https://mainnet.infura.io/v3/...',
    }
  })

  return provider
}

const eip1193Provider = await getWalletConnectProvider()

const browserProvider = new BrowserProvider(eip1193Provider, {
  chainId: Network.Mainnet,
  name: 'mainnet',
})

const sdk = new StakeWiseSDK({
  network: Network.Mainnet,
  provider: browserProvider,
})
```

### `Safe{Wallet}`

```ts
import { BrowserProvider } from 'ethers'
import { StakeWiseSDK, Network } from '@stakewise/v3-sdk'
import SafeAppsSDK from '@safe-global/safe-apps-sdk'
import { SafeAppProvider } from '@safe-global/safe-apps-provider'

const getSafeWalletProvider = async () => {
  const sdk = new SafeAppsSDK()
  const info = await sdk.safe.getInfo()
  const provider = new SafeAppProvider(info, sdk)

  return provider
}

const eip1193Provider = await getSafeWalletProvider()

const browserProvider = new BrowserProvider(eip1193Provider, {
  chainId: Network.Mainnet,
  name: 'mainnet',
})

const sdk = new StakeWiseSDK({
  network: Network.Mainnet,
  provider: browserProvider,
})
```

### `Coinbase`

```ts
import { BrowserProvider } from 'ethers'
import { StakeWiseSDK, Network } from '@stakewise/v3-sdk'
import { createCoinbaseWalletSDK } from '@coinbase/wallet-sdk'

const getCoinbaseProvider = () => {
  const sdk = createCoinbaseWalletSDK({
    appLogoUrl: 'LOGO_URL',
    appName: 'APP_NAME',
    appChainIds: [ 1 ],
  })

  const provider = sdk.getProvider()

  return provider
}

const eip1193Provider = getCoinbaseProvider()

const browserProvider = new BrowserProvider(eip1193Provider, {
  chainId: Network.Mainnet,
  name: 'mainnet',
})

const sdk = new StakeWiseSDK({
  network: Network.Mainnet,
  provider: browserProvider,
})
```

## Event Handling

Always subscribe to provider events to handle wallet state changes:

```ts
const setupEventHandlers = (provider: EIP1193Provider) => {
  provider.on('accountsChanged', (accounts: string[]) => {
    console.log('Accounts changed:', accounts)
    // Update your UI or reconnect SDK
  })

  provider.on('chainChanged', (chainId: string) => {
    console.log('Network changed:', chainId)
    // Reinitialize SDK with new network
  })

  provider.on('disconnect', (error: any) => {
    console.log('Wallet disconnected:', error)
    // Reset to read-only mode
  })
}

setupEventHandlers(eip1193Provider)
```
