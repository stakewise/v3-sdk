---
id: getStakerActions
slug: /vault/requests/getstakeractions
---

#### Description:

Get a list of interactions with the vault.

#### Arguments:

| Name         | Type                  | Required | Description                                                                                                |
|--------------|-----------------------|----------|------------------------------------------------------------------------------------------------------------|
| vaultAddress | `string`              | **Yes**  | The address of the vault                                                                                   |
| userAddress  | `string`              | **No**   | If a user address is specified, the query will look for events for that address and the vault address only |
| types        | `AllocatorActionType` | **Yes**  | Event types can be found in `enum AllocatorActionType` which you can import from the library               |
| limit        | `number`              | **Yes**  | To implement pagination                                                                                    |
| skip         | `number`              | **Yes**  | To implement pagination                                                                                    |

#### Returns:

```ts
type Output = Array<{
  actionType: AllocatorActionType
  createdAt: number
  assets: string
  shares: string
  link: string
  id: string
}>
```

In events related to osToken you can use shares, in all other assets

| Name | Description |
|------|-------------|
| `id` | Event identifier |
| `assets` | Transaction amount |
| `shares` | Transaction amount |
| `createdAt` | Transaction date |
| `actionType` | Type of action |
| `link` | Transaction link (etherscan/blockscout) |

#### Example:

```ts
import { AllocatorActionType } from '@stakewise/v3-sdk'

await sdk.vault.getStakerActions({
  skip: 0,
  limit: 20,
  userAddress: '0x...',
  vaultAddress: '0x...',
  types: [
    AllocatorActionType.Redeemed,
    AllocatorActionType.Deposited,
    AllocatorActionType.VaultCreated,
    AllocatorActionType.ExitedAssetsClaimed,
  ],
})
```
