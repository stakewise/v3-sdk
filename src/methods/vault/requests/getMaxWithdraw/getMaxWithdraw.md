---
id: getMaxWithdraw
slug: /vault/requests/getmaxwithdraw
---

#### Description:

How much a user can withdraw. Use this method if the user has mintedAssets, if minted balance is null then maxWithdraw will be equal to stakedAssests.

#### Arguments:

| Name         | Type     | Required | Info                                                         |
|--------------|----------|----------|--------------------------------------------------------------|
| vaultAddress | `string` | **Yes**  | The address of the vault                                     |
| ltvPercent   | `bigint` | **Yes**  | [sdk.vault.getVault](/vault/requests/getvault)               |
| mintedAssets | `bigint` | **Yes**  | [sdk.osToken.getPosition](/osToken/requests/getposition)     |
| stakedAssets | `bigint` | **Yes**  | [sdk.vault.getStakeBalance](/vault/requests/getstakebalance) |

#### Returns:

```ts
type Output = bigint
```

#### Example:

```ts
await sdk.vault.getMaxWithdraw({
  ltvPercent: 0n,
  mintedAssets: 0n,
  stakedAssets: 0n,
  vaultAddress: '0x...',
})
```
