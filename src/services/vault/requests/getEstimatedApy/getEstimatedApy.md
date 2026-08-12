---
id: getEstimatedApy
slug: /sdk/api/vault/requests/getestimatedapy
description: Use the StakeWise SDK getEstimatedApy method to project a user's vault APY after staking, minting, burning or boosting.
---

#### Description:

Estimates the user's APY after a pending action by applying position deltas. Pass zero deltas to get the current APY.

#### Arguments:

| Name               | Type     | Required | Description                                                        |
|--------------------|----------|----------|--------------------------------------------------------------------|
| userAddress        | `string` | **Yes**  | The address of the user                                            |
| vaultAddress       | `string` | **Yes**  | The address of the vault                                           |
| stakedAssetsDelta  | `bigint` | No       | Change in staked assets (e.g. `+assets` to stake, `-assets` to unstake). Defaults to `0n` |
| mintedSharesDelta  | `bigint` | No       | Change in minted osToken shares (`+shares` to mint, `-shares` to burn). Defaults to `0n`  |
| boostedSharesDelta | `bigint` | No       | Change in boosted osToken shares (`+shares` to boost). Defaults to `0n`                    |

#### Returns:

```ts
type Output = number
```

#### Example:

```ts
await sdk.vault.getEstimatedApy({
  userAddress: '0x...',
  vaultAddress: '0x...',
  stakedAssetsDelta: 1000000000000000000n,
})
```
