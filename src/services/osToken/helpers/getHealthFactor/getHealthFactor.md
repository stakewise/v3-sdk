---
id: getHealthFactor
slug: /sdk/api/osToken/helpers/gethealthfactor
description: Use the StakeWise SDK getHealthFactor helper to assess the health of an osToken position relative to liquidation thresholds.
---

#### Description:

Get the health of the position

#### Arguments:
| Name             | Type     | Required | Description                                          |
|------------------|----------|----------|------------------------------------------------------|
| liqThresholdPercent | `bigint` | **Yes**  | [sdk.vault.getVault](/sdk/api/vault/requests/getvault)               |
| mintedAssets     | `bigint` | **Yes**  | [sdk.osToken.getPosition](/sdk/api/osToken/requests/getposition)              |
| stakedAssets     | `bigint` | **Yes**  | [sdk.vault.getStakeBalance](/sdk/api/vault/requests/getstakebalance) |

#### Returns:

```ts
type Output = {
  value: number
  health: OsTokenPositionHealth
}
```

| Name | Description |
|------|-------------|
| `value` | Numerical value |
| `health` | Position Health (enum) |

#### Example:

```ts
sdk.osToken.getHealthFactor({
  liqThresholdPercent: 0n,
  mintedAssets: 0n,
  stakedAssets: 0n,
})
```
