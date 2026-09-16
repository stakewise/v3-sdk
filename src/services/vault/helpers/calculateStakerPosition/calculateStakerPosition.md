---
id: calculateStakerPosition
slug: /sdk/api/vault/helpers/calculatestakerposition
description: Use the StakeWise SDK calculateStakerPosition helper to calculate a user's net staker APY and total assets after staking, minting, burning or boosting.
---

#### Description:

Calculates the staker's net APY and total assets across the wallet, mint and boost from the result of `getPositionData` and optional deltas. Synchronous, no requests. Zero deltas return the current position. For a single vault use `calculateAllocatorPosition`.

#### Arguments:

| Name               | Type           | Required | Description                                       |
|--------------------|----------------|----------|---------------------------------------------------|
| data               | `PositionData` | **Yes**  | Result of `getPositionData`                       |
| stakedAssetsDelta  | `bigint`       | No       | Change in staked assets. Defaults to `0n`         |
| mintedSharesDelta  | `bigint`       | No       | Change in minted osToken shares. Defaults to `0n` |
| boostedSharesDelta | `bigint`       | No       | Change in boosted osToken shares. Defaults to `0n` |

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

const { apy, totalAssets } = sdk.vault.helpers.calculateStakerPosition({
  data,
  stakedAssetsDelta: parseEther('1'),
})
```
