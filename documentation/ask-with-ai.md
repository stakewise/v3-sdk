---
id: ask-with-ai
title: Ask StakeWise with AI
sidebar_position: 5
description: Use a lightweight markdown skill to let any LLM (ChatGPT, Claude, Perplexity, Cursor) answer StakeWise V3 read questions directly, without an SDK install on the user side.
---

# Ask StakeWise with AI

StakeWise ships a **lightweight skill** for AI assistants — a single markdown bundle that instructs any LLM to query StakeWise V3 read endpoints directly via WebFetch / curl. No SDK install required for the end user; the model handles HTTP itself and returns natural-language answers about vault APY, your stake, exit queue ETA, osETH health, boost position, distributor claims, vestings, and more.

The skill is hosted at [`stakewise/llm-tools`](https://github.com/stakewise/llm-tools). It is read-only — write transactions still go through this SDK or `app.stakewise.io`.

## When to use this vs the SDK

- **Skill** — end-user-facing, natural-language Q&A in any language, no install on the user's machine. Best for "what is my stake worth?" / "when can I withdraw?" / "is my osETH healthy?" style questions.
- **SDK** (`@stakewise/v3-sdk`) — developer-facing, typed access, write transactions, batched reads with `AbortPromise`. Best for building application integrations and any flow that needs to send a tx.

Both target the same underlying data sources. The skill is a shortcut for the read path with LLM intermediation; the SDK remains the canonical programmatic interface.

## Install — Claude Code

Open Claude Code and run:

```bash
/plugin marketplace add stakewise/llm-tools
/plugin install stakewise-data-query@stakewise-llm-tools
```

The skill activates automatically when the user asks a StakeWise question in any language. It then queries the public subgraphs and backend GraphQL on Mainnet, Gnosis, and Hoodi.

## Install — other LLMs

For ChatGPT (incl. Custom GPTs), Perplexity Spaces, DeepSeek, Cursor without MCP, or any chat that lets you set a system prompt or upload context — paste this single URL:

```
https://raw.githubusercontent.com/stakewise/llm-tools/main/data-skill/llm-context.md
```

That is a ~136 KB markdown bundle containing the skill instructions, endpoint tables, entity schemas, 19 worked query recipes, unit conventions, and a public-RPC fallback list. The LLM reads it once into its context window and is then equipped to call subgraphs on its own.

## What the skill can answer

- Vault APY (current, base, extra, max-with-boost) and fee structure
- Your stake, earnings, transaction history in any vault
- Exit queue ETA — when can you withdraw?
- osETH / osGNO health factor and remaining mint capacity
- Boost position (supplied collateral, borrowed assets, leverage status)
- Distributor (merkle) claims you have not picked up
- Vesting unlock schedules — what is claimable right now
- Sub-vault composition of meta-vaults (including nested)
- Cross-network position aggregates (Mainnet + Gnosis + Hoodi parallel)
- Live exchange rates: osETH/ETH, ETH/USD, fiat conversion

## How discovery works

This SDK's documentation is indexed at [context7.com/stakewise/v3-sdk](https://context7.com/stakewise/v3-sdk) for AI lookup of programmatic patterns. When a developer asks an LLM "how do I deposit via the SDK?", that index is the source of truth.

The lightweight skill at `stakewise/llm-tools` covers the **other** half — when an end user (not a developer) asks "what is my stake?" the skill answers directly without writing code. Both can be used together: a developer Custom GPT in ChatGPT can load both URLs and switch between them depending on the question.

```typescript
// SDK example for comparison — programmatic, returns typed data
import { StakeWiseSDK, Network } from '@stakewise/v3-sdk'

const sdk = new StakeWiseSDK({ network: Network.Mainnet })

const userData = await sdk.vault.getUserData({
  vaultAddress: '0xac0f906e433d58fa868f936e8a43230473652885',
  userAddress: '0x...',
})

console.log(userData.assets, userData.apy, userData.ltvStatus)
```

For the same question via the skill, the end user simply asks "What is my stake in the Genesis Vault on Mainnet?" and the LLM constructs the equivalent GraphQL query against `graphs.stakewise.io/mainnet/.../prod` on its own.

## Maintenance and updates

The skill version (currently `0.1.0`) is independent of this SDK. When this SDK's `helpers/configs/*.ts` URLs or schema change, a pre-push hook in `stakewise/frontwise` (`scripts/check-skill-drift.sh`) prints an advisory on the developer machine, signalling that the skill needs a follow-up update in `stakewise/llm-tools`. See [llm-tools README](https://github.com/stakewise/llm-tools) for the full maintenance contract.
