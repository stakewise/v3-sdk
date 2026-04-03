---
id: getSubVaults
slug: /sdk/api/vault/requests/getsubvaults
---

#### Description:

Returns the list of sub vaults.

#### Arguments:

| Name | Type | Required | Description                                               |
|------|------|----------|-----------------------------------------------------------|
| vaultAddress | `string` | **Yes**  | The address of the meta vault                                  |
| search | `string`        | **No** | Filters results by the address field   |
| limit | `number` | **No**   | Limits the number of sub vaults returned. Defaults to 100 |
| skip | `number` | **No**   | Skips the specified number of sub vaults. Defaults to 0   |

#### Returns:

```ts
type Output = {
  id: string
  apy: string
  imageUrl: string
  displayName: string
  stakingAssets: bigint
  exitingAssets: bigint
}
```

| Name | Description |
|------|-------------|
| `id`               | Vault address |
| `imageUrl`               | The image URL extracted from the metadata IPFS file. Will be `null` if the vault does not have an image. |
| `displayName`               | Name of vault |
| `stakingAssets`               | The amount of assets staking in the sub-vault. |
| `exitingAssets`               | The amount of assets exiting the sub-vault. |
| `apy`               | The sub-vault average weekly APY |

#### Example:

```ts
await sdk.vault.getSubVaults({
  skip: 0,
  limit: 5,
  vaultAddress: '0x...'
})
```
