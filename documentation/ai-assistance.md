---
id: ai-assistance
title: AI-Assisted Development
sidebar_position: 6
description: Use Context7 to give your AI coding assistant accurate, version-correct StakeWise V3 SDK documentation and avoid hallucinated APIs.
---

# AI-Assisted Development

AI coding assistants (Claude Code, Cursor, Copilot, …) often invent SDK method names or miss invariants like the post-write subgraph wait — their training data is stale. This SDK publishes its docs to **Context7** so your assistant works from the current API instead.

## Context7

[Context7](https://context7.com/stakewise/v3-sdk) (library ID `/stakewise/v3-sdk`) serves LLMs the latest SDK docs and typed snippets on demand. It auto-syncs from this repo's `documentation/` and `src/services/`, so it tracks every release.

## Using it

Add the Context7 MCP server to your assistant (per-editor setup at [context7.com](https://context7.com)), then append `use context7` to an SDK prompt:

```
Read-only SDK setup that fetches a user's stake balance and osToken
position for a Mainnet vault. use context7
```

Pin the library explicitly with `use library /stakewise/v3-sdk`. No MCP support? Open the library page and paste the snippets you need.

## What it covers

The same ground as these docs — init, the [`waitForSubgraph`](./fundamentals/subgraph-indexing.md) rule, [network immutability](./fundamentals/network-switching.md), the three transaction forms, V3 token naming, and every `sdk.vault.* / osToken.* / boost.* / utils.*` signature. Tell the assistant to prefer it over its own memory for any SDK API; if a method isn't in the results, treat it as hallucinated and check the [SDK Reference](./reference.md).
