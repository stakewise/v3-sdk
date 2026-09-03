---
id: getStakerPosition
slug: /sdk/api/vault/requests/getstakerposition
description: Use the StakeWise SDK getStakerPosition method to estimate a user's net staker APY and total assets after staking, minting, burning or boosting.
---

#### Description:

Estimates the staker's net APY and total assets after a pending action by applying position deltas (net osToken across the wallet, mint and boost). Pass zero deltas to get the current position. Use this for the aggregate staker position; use `getAllocatorPosition` for a single vault.

#### Arguments:

| Name               | Type     | Required | Description                                                        |
|--------------------|----------|----------|--------------------------------------------------------------------|
| userAddress        | `string` | **Yes**  | The address of the user                                            |
| vaultAddress       | `string` | **Yes**  | The address of the vault                                           |
| stakedAssetsDelta  | `bigint` | No       | Change in staked assets. Defaults to `0n`                          |
| mintedSharesDelta  | `bigint` | No       | Change in minted osToken shares. Defaults to `0n`                  |
| boostedSharesDelta | `bigint` | No       | Change in boosted osToken shares. Defaults to `0n`                 |

#### Returns:

```ts
type Output = {
  apy: number
  totalAssets: bigint
}
```

#### Example:

```ts
await sdk.vault.getStakerPosition({
  userAddress: '0x...',
  vaultAddress: '0x...',
  stakedAssetsDelta: 1000000000000000000n,
})
```
