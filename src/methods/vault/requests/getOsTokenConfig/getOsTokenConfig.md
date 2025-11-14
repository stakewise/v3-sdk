---
id: getOsTokenConfig
slug: /vault/getostokenconfig
---

#### Description:

Returns osToken collateral parameters for the specified vault: `ltvPercent` and `liqThresholdPercent`.

#### Arguments:

| Name         | Type     | Required | Description   |
|--------------|----------|----------|---------------|
| vaultAddress | `string` | **Yes**  | The address of the vault |

#### Returns:

```ts
type Output = {
  ltvPercent: bigint
  liqThresholdPercent: bigint
}
```
| Name | Description |
|------|-------------|
| `ltvPercent` | The percent used to calculate how much user can mint OsToken shares |
| `liqThresholdPercent` | The liquidation threshold percent used to calculate health factor for OsToken position |

#### Example:

```ts
await sdk.utils.getOsTokenConfig({ vaultAddress: '0x...' })
```
