---
id: getConfig
---

#### Description:

Deprecated, use `const { osTokenConfig } = await sdk.vault.getVault()` instead.
Returns basic information on the token

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
await sdk.osToken.getConfig({ vaultAddress: '0x...' })
```
