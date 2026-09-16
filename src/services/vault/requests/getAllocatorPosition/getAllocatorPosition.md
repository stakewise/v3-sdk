---
id: getAllocatorPosition
slug: /sdk/api/vault/requests/getallocatorposition
description: Use the StakeWise SDK getAllocatorPosition method to calculate a user's vault APY and total staked assets after staking, minting, burning or boosting.
---

#### Description:

Calculates the user's APY and total staked assets in a vault from the result of `getPositionData` and optional deltas. Zero deltas return the current position.

A negative `boostedSharesDelta` is ignored: unboosted shares stay in the position while they are exiting.

#### Arguments:

| Name               | Type           | Required | Description                                                        |
|--------------------|----------------|----------|--------------------------------------------------------------------|
| data               | `PositionData` | **Yes**  | Result of `getPositionData`                                        |
| stakedAssetsDelta  | `bigint`       | No       | Change in staked assets (e.g. `+assets` to stake, `-assets` to unstake). Defaults to `0n` |
| mintedSharesDelta  | `bigint`       | No       | Change in minted osToken shares (`+shares` to mint, `-shares` to burn). Defaults to `0n`  |
| boostedSharesDelta | `bigint`       | No       | Change in boosted osToken shares (`+shares` to boost). Defaults to `0n`                    |

#### Returns:

```ts
type Output = {
  apy: number
  totalAssets: bigint
}
```

#### Example:

```ts
const data = await sdk.vault.getPositionData({
  userAddress: '0x...',
  vaultAddress: '0x...',
})

const { apy, totalAssets } = sdk.vault.getAllocatorPosition({
  data,
  stakedAssetsDelta: parseEther('1'),
})
```
