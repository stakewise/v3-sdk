# StakeWise V3 SDK repo guide

TypeScript ESM library for the StakeWise V3 staking protocol. Consumed by the StakeWise frontend and any third-party app integrating V3 vaults / osToken / boost.

## Layout

```
src/
├── StakeWiseSDK.ts      # Main entrypoint class
├── index.ts             # Public exports
├── contracts/           # ABIs + ethers contract factories
├── graphql/             # GraphQL queries + generated types
├── helpers/             # Stateless utilities (BigDecimal, configs, getGas, ...)
├── modules/             # gql-module (AbortPromise), local-storage
├── services/            # Vault, OsToken, Boost, Utils, RewardSplitter, DistributorRewards
└── types/               # Global StakeWise namespace
documentation/           # Markdown consumed by context7 + Docusaurus
context7.json            # Context7 ingestion config
```

## Common commands

```bash
pnpm test       # jest --clearCache && jest --all
pnpm build      # test + prepare (typechain + graphql codegen) + rollup
pnpm lint       # eslint src
pnpm graphql    # regenerate GraphQL types from schema + queries
pnpm typechain  # regenerate ABI types
```

## Conventions

- No semicolons in TS (eslint-enforced).
- Service methods are thin wrappers: each public method delegates to `services/<service>/<method>/index.ts`.
- Public exports go through `src/index.ts` and `src/helpers/index.ts`.
- New service utilities live under `src/services/<service>/<methodName>/index.ts` with colocated `<methodName>.spec.ts`.
- Tests use `ts-jest`, `jest.config.ts` controls them. Spec files match `**/*.spec.ts`.

## Context7 publishing checklist

This repo is published to https://context7.com/stakewise/v3-sdk. The `documentation/` folder is the primary input; `context7.json` controls ingestion. Score moves are visible at https://context7.com/stakewise/v3-sdk?tab=benchmark and refresh ~every 17 minutes from `master`.

Before opening a PR that touches `documentation/` or `context7.json`:

1. **Every code block has a language tag.** Use ` ```typescript `, ` ```bash `, ` ```json `, never untagged ` ``` `. Untagged blocks fail the Formatting metric.
2. **Every snippet is self-contained and runnable.** Include `import { StakeWiseSDK, Network } from '@stakewise/v3-sdk'` and `new StakeWiseSDK({...})` in the same fence. The Initialization metric explicitly looks for these.
3. **Title → 1–2 sentences → fenced code.** Each section follows the implicit TITLE / DESCRIPTION / SOURCE / LANGUAGE / CODE shape. Don't ship walls of code with no prose; don't ship walls of prose with no code.
4. **Front-matter on every file.** `id`, `title`, `sidebar_position`, `description`. The Docusaurus build also requires this.
5. **One H1 per file** (the `# Title` matching frontmatter `title`). Don't skip levels, H1 → H2 → H3.
6. **No internal helpers, tests, or scripts in `documentation/`.** Those go in `src/`. `context7.json` already excludes `src/`, `scripts/`, `dist/`, `node_modules/`, and lockfiles, don't mix categories.
7. **Sync `context7.json` `rules[]` with the consumer skill.** If you change SDK conventions (post-write subgraph wait, V3 token naming, network immutability, etc.), update both `context7.json` and `frontwise/.claude/skills/stakewise-v3-sdk/SKILL.md` in the same PR. They drift fast otherwise.
8. **No V2 terminology in V3 docs.** `osETH` / `osGNO` / `osToken` only. `sETH2` and `rETH2` are V2, never reference them in V3 examples.
9. **After merge to `master`:** if the library has been claimed on the Context7 dashboard, hit "refresh" so the auto-pull doesn't lag your launch.
10. **Optionally before PR:** check the score impact locally with `npx @upstash/c7score` against the branch, target ≥95.

## First-publish playbook (one-time)

The repo's existing `context7.json` was minimal (just `url` + `public_key`). Switching to a full schema config with `branch: "context7"` (or any non-default branch) requires a one-time coordination step, otherwise the first auto-pull silently drops back to the old config.

1. **Open the SDK PR** on `stakewise/v3-sdk` containing the new `context7.json` and docs.
2. **Claim the library** at https://context7.com or open an issue at https://github.com/upstash/context7 referencing `stakewise/v3-sdk`. You need the StakeWise GitHub org's confirmation. This unlocks the owner dashboard.
3. **In the dashboard, set the source branch** to match `context7.json` (`master` or `context7`). The dashboard override beats the JSON file.
4. **Merge the PR** to `master`. Auto-pull fires within ~17 minutes.
5. **Verify the score** at https://context7.com/stakewise/v3-sdk?tab=benchmark. Target ≥95 average, all 10 benchmark questions ≥90.
6. **If the dashboard wasn't claimed in step 2,** the auto-pull reads the new `context7.json` from `master` but does NOT honour `branch: "context7"` until the library is claimed. Either remove the `branch` field for the first publish (default master), or claim before merging.

After the first publish, future doc PRs only need step 1 and step 5.

The Question metric is 80% of the score, it asks "do snippets answer typical user questions?" Failed benchmark questions are visible at the URL above; treat them as a TODO list when adding new docs.

## Documentation file rules (also enforced by frontwise CLAUDE.md)

- `.md` / `.mdx` files in `documentation/` MUST have `title` and `description` frontmatter.
- Use at least one `#` (H1) and never `###` (H3) without a preceding `##` (H2).

## Adding a service method

1. Create `src/services/<service>/<methodName>/index.ts` exporting a function `(input: CommonParams & UserInput) => Promise<Result>`.
2. (Optional) Colocated `<methodName>.spec.ts` mocking external dependencies.
3. Wire into `src/services/<service>/index.ts`: import, then add a public method on the service class with JSDoc `@description` + an `@see` link to the matching method page on `docs.stakewise.io/sdk/api/...`.
4. Document the method in `documentation/03-quick-start/<topic>.md` if it's user-facing, full snippet with imports + init.
5. Run `pnpm test`.

## Adding a write transaction

Write methods follow a 3-form pattern: `method`, `method.encode`, `method.estimateGas`. Look at `src/services/vault/transactions/deposit/` for the canonical layout. Document the method with all three forms shown.
