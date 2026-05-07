---
id: llms
title: LLM-friendly Q&A
sidebar_position: 99
description: Direct answers to common StakeWise V3 SDK questions covering initialization, provider modes, vault staking, unstaking, boost, network switching, and read-only vs signer SDKs. Each answer is a complete, runnable TypeScript snippet.
---

# StakeWise V3 SDK Q&A reference


Each section answers one common question with a complete, runnable TypeScript snippet. Snippets include all imports and SDK initialization so they work standalone.

## How do I initialize the StakeWise V3 SDK on Mainnet with an ethers provider?

Pass `network: Network.Mainnet` and an `ethers.BrowserProvider` (for browser wallets) or rely on `endpoints.web3` for read-only mode.

```typescript
import { BrowserProvider } from 'ethers'
import { StakeWiseSDK, Network } from '@stakewise/v3-sdk'

const sdk = new StakeWiseSDK({
  network: Network.Mainnet,
  provider: new BrowserProvider(window.ethereum),
})
```

For read-only / backend usage, drop `provider` and pass an RPC URL via `endpoints.web3`:

```typescript
import { StakeWiseSDK, Network } from '@stakewise/v3-sdk'

const sdk = new StakeWiseSDK({
  network: Network.Mainnet,
  endpoints: { web3: 'https://main-rpc.io' },
})
```

## How do I get the GraphQL subgraph URL for the configured network?

`sdk.config.api.subgraph` is an array of URLs. The first entry is the primary endpoint; if a query fails on the primary, the SDK retries once against the next URL. `sdk.config.api.backend` is the StakeWise backend API URL.

```typescript
import { StakeWiseSDK, Network } from '@stakewise/v3-sdk'

const sdk = new StakeWiseSDK({
  network: Network.Mainnet,
  endpoints: { web3: 'https://main-rpc.io' },
})

const [ primarySubgraph, ...fallbacks ] = sdk.config.api.subgraph

console.log('primary subgraph URL:', primarySubgraph)
console.log('fallbacks:', fallbacks)
console.log('backend API URL:', sdk.config.api.backend)
```

Override either at init time via `endpoints.subgraph` (string or array) and `endpoints.api`.

## How do I get an ethers Contract instance for the osToken (osETH on Mainnet)?

V3 uses `osToken` (osETH on Mainnet/Hoodi, osGNO on Gnosis). The token's ERC20 address is `sdk.config.addresses.tokens.mintToken`. `sETH2` is legacy V2, V3 has no sETH2.

```typescript
import { StakeWiseSDK, Network } from '@stakewise/v3-sdk'

const sdk = new StakeWiseSDK({
  network: Network.Mainnet,
  endpoints: { web3: 'https://main-rpc.io' },
})

const osTokenAddress = sdk.config.addresses.tokens.mintToken
const osToken = sdk.contracts.helpers.createErc20(osTokenAddress)

const totalSupply = await osToken.totalSupply()
```

For arbitrary tokens or contracts not in `sdk.contracts`, use the top-level `createContract(address, abi, provider)` export.

## How do I stake ETH into a StakeWise V3 vault?

Use `sdk.vault.deposit({ vaultAddress, userAddress, assets, referrerAddress })`. After the tx, await `sdk.utils.waitForSubgraph` before refetching balances.

```typescript
import { BrowserProvider, parseEther } from 'ethers'
import { StakeWiseSDK, Network } from '@stakewise/v3-sdk'

const sdk = new StakeWiseSDK({
  network: Network.Mainnet,
  provider: new BrowserProvider(window.ethereum),
})

const txHash = await sdk.vault.deposit({
  vaultAddress: '0x...',
  userAddress: '0x...',
  assets: parseEther('1.0'),
  referrerAddress: '0x0000000000000000000000000000000000000000',
})

await sdk.utils.waitForSubgraph({ hash: txHash })
```

## How do I initiate an unstake from a vault?

Call `sdk.vault.withdraw({ vaultAddress, userAddress, assets })` and wait for indexing. Then call `sdk.vault.getExitQueuePositions` to find the queue ticket.

```typescript
import { BrowserProvider, parseEther } from 'ethers'
import { StakeWiseSDK, Network } from '@stakewise/v3-sdk'

const sdk = new StakeWiseSDK({
  network: Network.Mainnet,
  provider: new BrowserProvider(window.ethereum),
})

const txHash = await sdk.vault.withdraw({
  vaultAddress: '0x...',
  userAddress: '0x...',
  assets: parseEther('0.5'),
})

await sdk.utils.waitForSubgraph({ hash: txHash })

const queue = await sdk.vault.getExitQueuePositions({
  vaultAddress: '0x...',
  userAddress: '0x...',
})
```

When the queue position is claimable, call `sdk.vault.claimExitQueue` to receive the assets.

## How do I lock osToken into the boost strategy?

`sdk.boost.lock({ amount, vaultAddress, userAddress })` boosts osToken APY through leverage staking. The SDK detects EOA vs multisig (Safe) wallets via `provider.getCode(userAddress)` and chooses the right approval flow internally. For EOA wallets pass `permitParams` if existing allowance is insufficient (use `sdk.utils.getPermitSignature` to obtain them); for multisig the SDK calls `approve` separately before the boost call.

```typescript
import { BrowserProvider, parseEther } from 'ethers'
import { StakeWiseSDK, Network } from '@stakewise/v3-sdk'

const sdk = new StakeWiseSDK({
  network: Network.Mainnet,
  provider: new BrowserProvider(window.ethereum),
})

const txHash = await sdk.boost.lock({
  amount: parseEther('1.0'),
  userAddress: '0x...',
  vaultAddress: '0x...',
  referrerAddress: '0x0000000000000000000000000000000000000000',
})

await sdk.utils.waitForSubgraph({ hash: txHash })
```

To unboost, call `sdk.boost.unlock({ percent, vaultAddress, userAddress })` (where `percent` is the share of the position to exit) and poll `sdk.boost.getQueuePosition` for the resulting queue ticket.

## How do I switch the SDK network from Mainnet to Gnosis at runtime?

SDK instances are immutable per network. To switch, construct a new instance, use a singleton factory to avoid recreation on every render.

```typescript
import { BrowserProvider } from 'ethers'
import { StakeWiseSDK, Network } from '@stakewise/v3-sdk'

const cache = new Map<Network, StakeWiseSDK>()

const getSDK = (network: Network) => {
  const cached = cache.get(network)
  if (cached) return cached

  const rpcUrls = {
    [Network.Mainnet]: 'https://main-rpc.io',
    [Network.Gnosis]: 'https://gnosis-rpc.io',
    [Network.Hoodi]: 'https://hoodi-rpc.io',
  }

  const sdk = new StakeWiseSDK({
    network,
    endpoints: { web3: rpcUrls[network] },
  })

  cache.set(network, sdk)
  return sdk
}

const mainnetSdk = getSDK(Network.Mainnet)
const gnosisSdk = getSDK(Network.Gnosis)
```

Listen for `chainChanged` on the EIP-1193 provider to swap the active SDK when the user changes networks in their wallet.

## What's the difference between a read-only and a signer-connected SDK?

- **Read-only**: pass `endpoints.web3` (RPC URL), omit `provider`. You can call all read methods (`getVault`, `getStakeBalance`, etc.) and `.encode(...)` / `.estimateGas(...)` on every write method, but calling the default form (e.g. `sdk.vault.deposit(...)`) throws `To send this transaction, please provide BrowserProvider to the StakeWiseSDK`. Note: `sdk.vault.multicall<T>(...)` has no `.encode` / `.estimateGas` and requires a signer-connected SDK.
- **Signer-connected**: pass `provider: new BrowserProvider(window.ethereum)` (or any wallet provider). You can both read and send transactions.

```typescript
import { BrowserProvider } from 'ethers'
import { StakeWiseSDK, Network } from '@stakewise/v3-sdk'

// Read-only
const readSdk = new StakeWiseSDK({
  network: Network.Mainnet,
  endpoints: { web3: 'https://main-rpc.io' },
})

const calldata = await readSdk.vault.deposit.encode({
  vaultAddress: '0x...',
  userAddress: '0x...',
  assets: parseEther('1.0'),
  referrerAddress: '0x0000000000000000000000000000000000000000',
})
// hand `calldata` to a wallet / Safe / custodial signing service

// Signer-connected
const writeSdk = new StakeWiseSDK({
  network: Network.Mainnet,
  provider: new BrowserProvider(window.ethereum),
})

const txHash = await writeSdk.vault.deposit({
  vaultAddress: '0x...',
  userAddress: '0x...',
  assets: parseEther('1.0'),
  referrerAddress: '0x0000000000000000000000000000000000000000',
})

await writeSdk.utils.waitForSubgraph({ hash: txHash })
```

A read-only SDK is typically used for dashboards, SSR pages, custodial backends, and any flow where signing happens externally.
