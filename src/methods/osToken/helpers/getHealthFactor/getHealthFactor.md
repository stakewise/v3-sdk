---
id: getHealthFactor
slug: /osToken/helpers/gethealthfactor
---

#### Description:

Get the health of the position

#### Arguments:
| Name             | Type     | Required | Description                                          |
|------------------|----------|----------|------------------------------------------------------|
| liqThresholdPercent | `bigint` | **Yes**  | [sdk.vault.getVault](/vault/requests/getvault)               |
| mintedAssets     | `bigint` | **Yes**  | [sdk.osToken.getPosition](/osToken/requests/getposition)              |
| stakedAssets     | `bigint` | **Yes**  | [sdk.vault.getStakeBalance](/vault/requests/getstakebalance) |

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
