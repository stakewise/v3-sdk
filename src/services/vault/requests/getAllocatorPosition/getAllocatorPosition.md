---
id: getAllocatorPosition
slug: /sdk/api/vault/requests/getallocatorposition
description: Use the StakeWise SDK getAllocatorPosition method to estimate a user's vault APY and total staked assets after staking, minting, burning or boosting.
---

#### Description:

Estimates the user's APY and total staked assets after a pending action by applying position deltas. Pass zero deltas to get the current position.

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
type Output = {
  apy: number
  totalStakedAssets: bigint
}
```

#### Example:

```ts
await sdk.vault.getAllocatorPosition({
  userAddress: '0x...',
  vaultAddress: '0x...',
  stakedAssetsDelta: 1000000000000000000n,
})
```
