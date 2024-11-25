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
#### Create SDK instance:

```typescript
import { StakeWiseSDK, Network } from '@stakewise/v3-sdk'

const sdk = new StakeWiseSDK({
  network: Network.Mainnet,
  endpoints: {
    web3: 'https://mainnet.infura.io/v3/...',
  },
})

```

#### SDK Constructor Arguments:

| Name               | Type                                                             | Required | Description               |
|--------------------|------------------------------------------------------------------|----------|---------------------------|
| network            | `Network`                                                        | **Yes**  | Chain id |
| provider           | `BrowserProvider or JsonRpcProvider`                             | **No**   | You can provide your implementation of the provender for ethers |
| endpoints.web3     | `string OR Array<(string \| { url: string, headers: Headers })>` | **No**   | Your urls for connecting to blockchain. This parameter is required if `provider` is not provided. If more than one URL is provided, they will be used as fallbacks. |
| endpoints.subgraph | `string`                                                         | **No**   | stakewise subgraph url |
| endpoints.api      | `string`                                                         | **No**   | stakewise backend url |

