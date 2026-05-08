---
id: endpoints
title: Available Endpoints
sidebar_position: 4
description: RPC, API and Subgraph endpoints for Mainnet, Gnosis and Hoodi networks.
---

# Available Endpoints

---

## How to retrieve the subgraph endpoint URL

The StakeWise V3 subgraph URL depends on the network the SDK is bound to. For SDK-driven workflows the subgraph URL is configured at construction time and the SDK queries it transparently - you do not need to read the URL yourself for typical reads. For direct GraphQL calls (custom queries, dashboards, monitoring), use the production URLs listed below under [Subgraph Endpoint](#subgraph-endpoint).

```typescript
import { StakeWiseSDK, Network } from '@stakewise/v3-sdk'

const sdk = new StakeWiseSDK({
  network: Network.Mainnet,
  endpoints: { web3: 'https://main-rpc.io' },
})

const stats = await sdk.utils.getStakewiseStats()
```

The SDK ships with the StakeWise V3 subgraph URL baked in for each `Network` (Mainnet, Hoodi, Gnosis), so all read methods (`getVault`, `getStakeBalance`, `getStakewiseStats`, etc.) hit the right subgraph automatically.

---

## RPC Endpoint

The RPC endpoint is the JSON-RPC URL of an Ethereum node for the selected network. You can use any public RPC provider - a curated list with public nodes for each chain is available at:

🔗 **[chainlist.org](https://chainlist.org/)**

✅ **Tip:** For production, prefer a dedicated provider (Infura, Alchemy, QuickNode, etc.) over a free public RPC - public RPCs are rate-limited and may go down.

---

## API Endpoint

GraphQL endpoint of the StakeWise backend.

| Network | Endpoint |
|---------|----------|
| **Mainnet** | `https://mainnet-api.stakewise.io/graphql` |
| **Gnosis** | `https://gnosis-api.stakewise.io/graphql` |
| **Hoodi** | `https://hoodi-api.stakewise.io/graphql` |

---

## Subgraph Endpoint

GraphQL endpoint of the StakeWise subgraph.

### Production

Use the **`prod`** endpoint for production environments.

| Network | Endpoint |
|---------|----------|
| **Mainnet** | `https://graphs.stakewise.io/mainnet/subgraphs/name/stakewise/prod` |
| **Gnosis** | `https://graphs.stakewise.io/gnosis/subgraphs/name/stakewise/prod` |
| **Hoodi** | `https://graphs.stakewise.io/hoodi/subgraphs/name/stakewise/prod` |

### Stage

Mirrors the production schema but tracks the staging deployment - use it only when reproducing issues against a non-production environment.

| Network | Endpoint |
|---------|----------|
| **Mainnet** | `https://graphs.stakewise.io/mainnet/subgraphs/name/stakewise/stage` |
| **Gnosis** | `https://graphs.stakewise.io/gnosis/subgraphs/name/stakewise/stage` |
| **Hoodi** | `https://graphs.stakewise.io/hoodi/subgraphs/name/stakewise/stage` |
