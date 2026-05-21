---
id: getSubVaults
slug: /sdk/api/vault/requests/getsubvaults
description: Use the StakeWise SDK getSubVaults method to list sub-vaults of a StakeWise V3 meta vault with paging support. Returns per-vault APY, display name, image URL, staking and exiting assets.
---

#### Description:

Returns the list of sub vaults for a given meta vault.

#### Arguments:

| Name | Type | Required | Description                                               |
|------|------|----------|-----------------------------------------------------------|
| vaultAddress | `string` | **Yes**  | The address of the meta vault                                  |
| limit | `number` | **Yes**   | Limits the number of sub vaults returned |
| skip | `number` | **Yes**   | Skips the specified number of sub vaults |

#### Returns:

```ts
type Output = Array<{
  id: string
  apy: string
  imageUrl: string
  displayName: string
  stakingAssets: bigint
  exitingAssets: bigint
}>
```

| Name | Description |
|------|-------------|
| `id`               | Address of vault |
| `apy`               | Current vault apy |
| `imageUrl`               | Link for vault logo |
| `displayName`               | Name of vault |
| `stakingAssets`               | The amount of assets staking in the sub vault |
| `exitingAssets`               | The total number of assets that are exiting the sub vault |

#### Example:

```ts
await sdk.vault.getSubVaults({
  skip: 0,
  limit: 20,
  vaultAddress: '0x...'
})
```
