---
id: connecting
title: Connecting a Wallet
sidebar_position: 3
---

# Connecting a Wallet

To enable your users to send transactions (such as `sdk.vault.deposit`), your application needs to connect their wallet to the SDK.  
This connection is established using an **[EIP-1193 provider](https://eips.ethereum.org/EIPS/eip-1193)**.

```ts
interface Eip1193Provider {
  on(event: "connect", listener: (info: ProviderInfo) => void): void
  on(event: "disconnect", listener: (error: ProviderRpcError) => void): void
  on(event: "message", listener: (message: ProviderMessage) => void): void
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

## Direct Integration (Optional)

If you prefer to integrate directly with specific wallet libraries, you can do so by following the examples below. After connecting to the provider, it is recommended to subscribe to events and pass handlers for network or address changes, as well as for disconnection events.

```ts
eip1193Provider.on('disconnect', disconnect)
eip1193Provider.on('chainChanged', chainChanged)
eip1193Provider.on('accountsChanged', accountsChanged)
```

### Binance

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

### WalletConnect

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

### Safe{Wallet}

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

### Coinbase

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
