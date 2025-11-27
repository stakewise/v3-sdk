---
id: getVaultVersion
slug: /vault/requests/getvaultversion
---

#### Description:

Getting the vault current version.

#### Arguments:

| Name   | Type     | Required | Description                    |
|--------|----------|----------|--------------------------------|
| vaultAddress | `string` | **Yes**  | The address of the vault | 

#### Returns:

```ts
type Output = {
  version: number
  isV1Version: boolean
  isV2Version: boolean
  isMoreV1: boolean
  isMoreV2: boolean
}
```

| Name          | Description                                              |
|---------------|----------------------------------------------------------|
| `version`     | current vault version                       |
| `isV1Version` | 1 version                    |
| `isV2Version` | 2 version                    |
| `isMoreV1`    | 2+ version                   |
| `isMoreV2`    | 3+ version                   |

#### Example:

```ts
await sdk.vault.getVaultStats({ vaultAddress: '0x...' })
```
