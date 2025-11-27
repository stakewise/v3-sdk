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
  totalStakeEarnedAssets: bigint
  totalBoostEarnedAssets: bigint
}
```

| Name                | Description             |
|---------------------|-------------------------|
| `assets`            | Balance in ETH          |
| `totalEarnedAssets` | Total earned rewards    |
| `totalStakeEarnedAssets` | Total earned assets from staking    |
| `totalBoostEarnedAssets` | Total earned assets from boost    |

#### Example:

```ts
await sdk.vault.getStakeBalance({
  userAddress: '0x...',
  vaultAddress: '0x...',
})
```
