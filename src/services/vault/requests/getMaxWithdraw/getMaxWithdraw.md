---
id: getMaxWithdraw
title: getMaxWithdraw
slug: sdk/api/vault/requests/getmaxwithdraw
description: "StakeWise SDK getMaxWithdraw method (deprecated): calculates the maximum withdrawal amount based on staked and minted assets."
---

# Deprecated!
Use getMaxWithdrawAmount

#### Description:

How much a user can withdraw. Use this method if the user has mintedAssets, if minted balance is null then maxWithdraw will be equal to stakedAssests.

#### Arguments:

| Name         | Type     | Required | Info                                                         |
|--------------|----------|----------|--------------------------------------------------------------|
| vaultAddress | `string` | **Yes**  | The address of the vault                                     |
| ltvPercent   | `bigint` | **Yes**  | [sdk.vault.getVault](/sdk/api/vault/requests/getvault)               |
| mintedAssets | `bigint` | **Yes**  | [sdk.osToken.getPosition](/sdk/api/osToken/requests/getposition)     |
| stakedAssets | `bigint` | **Yes**  | [sdk.vault.getStakeBalance](/sdk/api/vault/requests/getstakebalance) |

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
