---
id: concepts
title: Core concepts
sidebar_position: 0
description: Conceptual overview of StakeWise V3 building blocks - vaults, osToken (osETH/osGNO), Boost leverage staking, MEV escrow vs Smoothing Pool, reward splitter, and the harvest workflow. Maps each concept to the SDK methods that interact with it.
---

# Core concepts

Short primer on the StakeWise V3 building blocks the SDK exposes. Each section maps the concept to the relevant SDK call.

## What is a Vault?

A **vault** is an on-chain contract that pools staked assets (ETH on Mainnet/Hoodi, GNO on Gnosis), runs validators against them, and tracks each staker's share. Anyone can deploy and manage their own vault. The SDK fetches vault state with `sdk.vault.getVault({ vaultAddress })` and creates new vaults with `sdk.vault.create({...})`.

```ts
import { StakeWiseSDK, Network } from '@stakewise/v3-sdk'

const sdk = new StakeWiseSDK({
  network: Network.Mainnet,
  endpoints: { web3: 'https://main-rpc.io' },
})

const vault = await sdk.vault.getVault({ vaultAddress: '0xVaultAddress' })
```

## Vault types

Three access models, set at creation time via the `type` argument of `sdk.vault.create`:

- **`VaultType.Default`** — open to any depositor.
- **`VaultType.Private`** — restricted to a whitelist managed by the vault admin (`sdk.vault.getWhitelist`, whitelist write methods).
- **`VaultType.Blocklist`** — open to anyone except blocked addresses (`sdk.vault.getBlocklist`).

Orthogonal to that, the optional `vaultToken: { name, symbol }` argument turns the vault into an **ERC20 vault** that issues a transferable share token. Omit it for a non-ERC20 vault where shares are tracked internally.

## What is osToken (osETH / osGNO)?

**osToken** is the StakeWise liquid staking token: **osETH** on Ethereum Mainnet and Hoodi, **osGNO** on Gnosis. Stakers mint osToken against their vault deposit, keeping the underlying stake productive while gaining a transferable, redeemable token. The osToken ERC20 address lives at `sdk.config.addresses.tokens.mintToken`.

```ts
import { StakeWiseSDK, Network } from '@stakewise/v3-sdk'

const sdk = new StakeWiseSDK({
  network: Network.Mainnet,
  endpoints: { web3: 'https://main-rpc.io' },
})

const apy = await sdk.osToken.getAPY()
const osTokenAddress = sdk.config.addresses.tokens.mintToken
const osToken = sdk.contracts.helpers.createErc20(osTokenAddress)
const totalSupply = await osToken.totalSupply()
```

osToken redemption is at the protocol exchange rate — instant if unbonded assets are available in the vault, otherwise the vault exits validators to fulfill the request.

## Health factor

When a user mints osToken against their stake, the position has a **health factor** that reflects the LTV ratio against the vault's liquidation threshold. Use `sdk.osToken.getHealthFactor` before minting to avoid unhealthy positions; the result is one of `OsTokenPositionHealth.Healthy / Moderate / Risky / Unhealthy`.

## What is Boost?

**StakeWise Boost** is a leverage strategy: users mint osToken against their vault stake, then re-stake the borrowed value in a loop to amplify yield. The SDK exposes the strategy proxy address via `sdk.boost.getLeverageStrategyProxy` and the lock/unlock transactions via `sdk.boost.lock` / `sdk.boost.unlock`. Position state comes from `sdk.boost.getData`.

The strategy keeps near-perfect collateral correlation (osETH against ETH, osGNO against GNO), so liquidation risk is bounded by the protocol's redemption guarantee.

## MEV escrow vs Smoothing Pool

When creating a vault, `isOwnMevEscrow` decides where block rewards go:

- **`false` (default)** — rewards flow to the **Smoothing Pool**, a network-wide MEV pool that distributes proportionally across all participating vaults. Reduces variance.
- **`true`** — the vault has its **own MEV escrow** contract. The vault keeps its own MEV rewards but bears the variance.

## Reward splitter

A **reward splitter** is a contract that distributes a vault's rewards across multiple recipients in fixed proportions. The vault admin deploys one with `sdk.rewardSplitter.createRewardSplitter`, configures shares with `updateFeeRecipients`, and recipients claim with `claimRewards`. List existing splitters for a vault with `sdk.vault.getRewardSplitters`.

## Harvest (vault state update)

Before deposits, mints, or other state-dependent reads can use the latest validator rewards, the vault must be **harvested** — its on-chain state updated with the latest oracle proof. The SDK provides `sdk.vault.getHarvestParams` to fetch the proof and `canHarvest` flag, and `sdk.vault.operate` to submit the state update transaction. Most user-facing flows do not need to call this manually; the deposit/withdraw paths handle it transparently.

## Subgraph indexing

Every write transaction (`deposit`, `withdraw`, `mint`, `burn`, `lock`, `unlock`, `createVault`, ...) updates the StakeWise subgraph asynchronously. Always wait for the subgraph to catch up before refetching read methods, otherwise data is stale:

```ts
import { StakeWiseSDK, Network } from '@stakewise/v3-sdk'

const sdk = new StakeWiseSDK({ network: Network.Mainnet, endpoints: { web3: 'https://main-rpc.io' } })

const hash = await sdk.vault.deposit({ vaultAddress: '0x...', userAddress: '0x...', assets: 1n })

await sdk.provider.waitForTransaction(hash)
await sdk.utils.waitForSubgraph({ hash })
```
