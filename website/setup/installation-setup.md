---
id: installation-setup
title: Installation and Setup
sidebar_position: 2
---

```bash
npm i @stakewise/v3-sdk
```

If your builder doesn't support `.graphql` files, then you need to add a plugin. For example, for webpack this would be graphql-tag.
If you are using another builder, you can easily find GQL support plugins

```typescript
webpackConfig.module.rules.push(
  {
    test: /\.(graphql|gql)$/,
    loader: 'graphql-tag/loader',
    exclude: /node_modules/,
  }
)
```
#### Create SDK instance

SDK without specified provider allows to call methods to get data such as `sdk.vault.getVault`,
but doesn't allow to send transactions such as `sdk.vault.deposit`

```typescript
import { StakeWiseSDK, Network } from '@stakewise/v3-sdk'

const sdk = new StakeWiseSDK({
  network: Network.Mainnet,
  endpoints: {
    web3: 'https://mainnet.infura.io/v3/...',
  },
})
```

SDK with specified provider allows to call methods to get data and send transactions

```typescript
import { BrowserProvider } from 'ethers'
import { StakeWiseSDK, Network } from '@stakewise/v3-sdk'

const sdk = new StakeWiseSDK({
  network: Network.Mainnet,
  provider: new BrowserProvider(window.ethereum, {
    name: 'mainnet',
    chainId: Network.Mainnet,
  }),
})
```

SDK with specified provider using wagmi connector.
Detailed example can be found [here](https://stackblitz.com/edit/stakewise-sdk?file=src%2Fcomponents%2Futil%2Findex.ts,src%2Fcomponents%2FConnect.tsx,src%2Fcomponents%2FSdkContext.tsx,src%2Fcomponents%2Futil%2FinitContext.ts,src%2Fwagmi.ts,src%2FApp.tsx,src%2Fcomponents%2FConnectWallet.tsx,src%2Fcomponents%2FAccount.tsx).

```typescript
import { BrowserProvider, Eip1193Provider } from 'ethers'
import { StakeWiseSDK, Network } from '@stakewise/v3-sdk'

wagmiConnector.getProvder()
  .then((library) => {
    const sdk = new StakeWiseSDK({
      network: Network.Mainnet,
      provider: new BrowserProvider(library as Eip1193Provider, {
        name: 'mainnet',
        chainId: Network.Mainnet,
      }),
    })
  })
```

#### SDK Constructor Arguments:

| Name               | Type                                                               | Required | Description                                                                                                                                                         |
|--------------------|--------------------------------------------------------------------|----------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| network            | `Network`                                                          | **Yes**  | Chain id                                                                                                                                                            |
| provider           | `BrowserProvider` or `JsonRpcProvider`                             | **No**   | You can provide your implementation of the provender for ethers. This parameter is required to send transactions.                                                   |
| endpoints.web3     | `string` or `Array<(string \| { url: string, headers: Headers })>` | **No**   | Your urls for connecting to blockchain. This parameter is required if `provider` is not provided. If more than one URL is provided, they will be used as fallbacks. |
| endpoints.subgraph | `string`                                                           | **No**   | stakewise subgraph url                                                                                                                                              |
| endpoints.api      | `string`                                                           | **No**   | stakewise backend url                                                                                                                                               |

