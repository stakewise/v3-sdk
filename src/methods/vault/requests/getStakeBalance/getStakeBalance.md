---
id: getStakeBalance
slug: /vault/requests/getstakebalance
---

#### Description:

Getting user's balance in the vault

#### Arguments:

| Name         | Type     | Required | Description               |
|--------------|----------|----------|---------------------------|
| userAddress  | `string` | **Yes**  | The user address          |
| vaultAddress | `string` | **Yes**  | The address of the vault  |

#### Returns:

```ts
type Output = {
  assets: bigint
  totalEarnedAssets: bigint
  totalOsTokenFeeAssets: bigint
  totalStakeEarnedAssets: bigint
  totalBoostEarnedAssets: bigint
  totalExtraEarnedAssets: bigint
}
```

| Name                | Description             |
|---------------------|-------------------------|
| `assets`            | Balance in ETH          |
| `totalEarnedAssets` | Total earned rewards    |
| `totalOsTokenFeeAssets` | Total earned rewards    |
| `totalStakeEarnedAssets` | Allocator's total OsToken fee assets    |
| `totalBoostEarnedAssets` | Total earned assets from boost    |
| `totalExtraEarnedAssets` | Total earned assets from extra incentives, rewards    |

#### Example:

```ts
await sdk.vault.getStakeBalance({
  userAddress: '0x...',
  vaultAddress: '0x...',
})
```
